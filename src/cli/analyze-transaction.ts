import { AccountInfo, KeyedAccountInfo, PublicKey, SystemProgram } from '@solana/web3.js';
import inquirer from 'inquirer';
import { connection } from '../common';
import { TokenDecoder } from '../decoders/token-program/token-decoder';
import { getAccountInfo, getAccountName } from '../util';

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
    const accountInfos: Array<KeyedAccountInfo> = [];
    for (let i = 0; i < accountKeys.length; i++) {
        try {
            accountInfos.push({
                accountId: accountKeys[i],
                accountInfo: await getAccountInfo(accountKeys[i].toString())
            });
        } catch (e) {
            console.log(`${e}`);
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
    return accountInfos;
}

/**
 * Analyze accounts
 * @param accountKeys
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
        await decodeTokenAccount(accountInfos[i]);
        await decodeMintAccount(accountInfos[i]);
    }
}

async function decodeTokenAccount(account: KeyedAccountInfo) {
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
    }
}

async function decodeMintAccount(account: KeyedAccountInfo) {
    const size = account.accountInfo.data.length;
    const owner = getAccountName(account.accountId);
    if (size === 82 && owner === 'Token Program') {
        console.log('Type: Mint');
    }
}