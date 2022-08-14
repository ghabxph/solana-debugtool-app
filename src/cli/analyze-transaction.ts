import { AccountInfo, KeyedAccountInfo, PublicKey, SystemProgram } from '@solana/web3.js';
import inquirer from 'inquirer';
import { connection } from '../common';
import { TokenDecoder } from '../decoders/token-program/token-decoder';
import { enableLogging, findOffsetFromAccountInfo, getAccountInfo, getAccountName } from '../util';

/**
 * Entrypoint
 */
export async function analyzeTransaction() {
    const { signature } = await inquirer.prompt([
        {
            type: "input",
            name: "signature",
            message: "Solana transaction signature to fetch",
            
        }
    ]);
    const tx = await connection.getTransaction(signature);
    const accountKeys = tx?.transaction.message.accountKeys as PublicKey[];
    console.log(``);
    console.log(`Accounts for txs: ${signature}`);
    console.log(`------------------------------------------------------------`);
    for (let i = 0; i < accountKeys.length; i++) {
        const isSigner = tx?.transaction.message.isAccountSigner(i) ? 'Signer' : null;
        const isWritable = tx?.transaction.message.isAccountWritable(i) ? 'Writable' : null;
        const isProgram = tx?.transaction.message.isProgramId(i) ? 'Program' : null;
        const alias = getAccountName(accountKeys[i]);
        const accountName = alias === accountKeys[i].toString() ? accountKeys[i] : `${accountKeys[i]} - ${alias}`;

        console.log(`Account ${i + 1}: ${accountName} - ${[isSigner, isWritable, isProgram].filter(Boolean).join(', ')}`)
    }
    const accountInfos = await downloadAccounts(accountKeys);
    await analyzeAccounts(accountInfos);
}

/**
 * Download accounts that are not yet downloaded for analysis
 * @param accountKeys
 */
async function downloadAccounts(accountKeys: Array<PublicKey>): Promise<Array<KeyedAccountInfo>> {
    console.log(``);
    console.log(`Downloading accounts...`);
    enableLogging(false);
    const accountInfos: Array<KeyedAccountInfo> = [];
    for (let i = 0; i < accountKeys.length; i++) {
        try {
            accountInfos.push({
                accountId: accountKeys[i],
                accountInfo: await getAccountInfo(accountKeys[i].toString())
            });
        } catch (e) {
            enableLogging();
            console.log(`${e}`);
            enableLogging(false);
            accountInfos.push({
                accountId: accountKeys[i],
                accountInfo: {
                    executable: false,
                    owner: SystemProgram.programId,
                    lamports: 0,
                    data: Buffer.from(new Uint8Array()),
                }
            });
        }
    }
    enableLogging();
    return accountInfos;
}

/**
 * Analyze accounts
 *
 * @param accountInfos
 */
async function analyzeAccounts(accountInfos: Array<KeyedAccountInfo>) {
    console.log(``);
    console.log(`Analyzing accounts...`);
    for (let i = 0; i < accountInfos.length; i++) {
        console.log(``);
        const address = accountInfos[i].accountId
        const accountInfo = accountInfos[i].accountInfo;
        console.log(`Account #${i + 1}: ${getAccountName(address)}`);
        console.log(`------------------------------------------------------------`);
        console.log(`Owner: ${getAccountName(accountInfo.owner)}`);
        console.log(`Initialized: ${accountInfo.lamports > 0 ? 'Yes': 'No'}`);
        console.log(`Size: ${accountInfo.data.length}`);
        const isTokenAccount = await decodeTokenAccount(accountInfos[i]);
        const isMintAccount = await decodeMintAccount(accountInfos[i]);
        const notInitialized = accountInfos[i].accountInfo.lamports === 0;
        const isExecutable = accountInfos[i].accountInfo.executable;
        const isSystemProgram = accountInfos[i].accountId.toString() === '11111111111111111111111111111111';
        const isTokenProgram = accountInfos[i].accountId.toString() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        const isRentSysvar = accountInfos[i].accountId.toString() === 'Sysvar1111111111111111111111111111111111111';
        const isOwnedBySystemProgram = accountInfos[i].accountInfo.owner.toString() === '11111111111111111111111111111111';
        const scanAccount = !(isTokenAccount || isMintAccount || notInitialized || isExecutable || isSystemProgram || isTokenProgram || isRentSysvar || isOwnedBySystemProgram);
        if (scanAccount) {
            await findAssociatedAccounts(accountInfos, i);
        }
    }
}

async function decodeTokenAccount(account: KeyedAccountInfo): Promise<boolean> {
    const address = account.accountId.toString();
    const size = account.accountInfo.data.length;
    const owner = getAccountName(account.accountInfo.owner);
    const data = account.accountInfo.data;
    if (size === 165 && owner === 'Token Program') {
        const token = new TokenDecoder(address);
        token.setData(data);
        console.log('Type: Token Account');
        console.log(`Mint: ${getAccountName(await token.mint)}`);
        console.log(`Amount: ${await token.amount}`);
        console.log(`Owner: ${getAccountName(await token.owner)}`);
        return true;
    }
    return false;
}

async function decodeMintAccount(account: KeyedAccountInfo): Promise<boolean> {
    const size = account.accountInfo.data.length;
    const owner = getAccountName(account.accountInfo.owner);
    if (size === 82 && owner === 'Token Program') {
        console.log('Type: Mint');
        return true;
    }
    return false;
}

async function findAssociatedAccounts(accounts: Array<KeyedAccountInfo>, index: number) {
    const account = accounts[index];
    for (let i = 0; i < accounts.length; i++) {
        const find = accounts[i].accountId.toString();
        enableLogging(false);
        const isSystemProgram = find.toString() === '11111111111111111111111111111111';
        if (!isSystemProgram) {
            const offset = await findOffsetFromAccountInfo(account.accountId.toString(), find);
            enableLogging();
            if (offset > -1) {
                console.log(`Account #${i + 1}: ${getAccountName(find)} found at offset: ${offset}`);
            }
        }
    }
    console.log(``);
}