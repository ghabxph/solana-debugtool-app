import * as solana from "@solana/web3.js";
import fs from 'fs';
import { getAccountInfo } from ".";

/**
 * Get account info. Once downloaded, it'll be cached. Setting cache parameter to false
 * will re-download the latest account info from the blockchain.
 *
 * @param address Account to fetch
 * @param connection Solana connection instance to use
 * @param cache Whether fetch from cache
 * @returns Returns the account info, or will throw an error if account does not exist.
 */
export async function _getAccountInfo(address: string, connection: solana.Connection, cache: boolean): Promise<solana.AccountInfo<Buffer>> {
    const path = `./.accounts/${address}.json`;
    if (cache === true) {
        console.log(`Checking whether ${address} is cached.`);
        if (fs.existsSync(path)) {
            let account = JSON.parse(fs.readFileSync(path, 'utf8'));
            console.log(`Cache found: ${path}`);
            return {
                executable: account.executable,
                owner: account.owner,
                lamports: account.lamports,
                data: Buffer.from(account.data, "base64"),
                rentEpoch: account.rentEpoch,
            }
        } else {
            console.log(`Account ${address} is not cached.`)
        }
    } else {
        console.log(`Caching is disabled.`);
    }
    console.log(`Fetching latest account info of ${address}`);
    const accountInfo = await connection.getAccountInfo(new solana.PublicKey(address));
    if (accountInfo === null || accountInfo.data === undefined) {
        throw Error(`Account: ${address} does not exist.`);
    }
    fs.writeFileSync(path, JSON.stringify(accountInfo));
    return accountInfo;
}

/**
 * Find the offset of base58-encoded bytes from account info data of given account address.
 *
 * @param address Address of account to fetch
 * @param needle Base58-encoded bytes to find
 * 
 * @return Returns the index of address. Returns -1 if it does not exist.
 */
export async function _findOffsetFromAccountInfo(address: string, needle: string): Promise<number> {
    const accountInfo = await getAccountInfo(address);
    for (let i = 0; i < accountInfo.data.length; i++) {
        const raw = accountInfo?.data.subarray(i, i + 32);
        const guess = new solana.PublicKey(raw);
        console.log(`index: ${i} -- Finding: ${needle} -- ${guess}`);
        if (needle === guess.toString()) {
            console.log(`Match at ${i}!`);
            return i;
        }
    }
    return -1;
}

const accounts = new Map<string, string>();
accounts.set('11111111111111111111111111111111', 'System Program');
accounts.set('SysvarRent111111111111111111111111111111111', 'Rent Sysvar');
accounts.set('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 'Token Program');
accounts.set('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL', 'Associated Token Account');
accounts.set('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', 'Marinade Staked SOL (mSOL)');
accounts.set('MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD', 'Marinade Staking Program');

/**
 * Returns the name of given account that is known by us.
 *
 * @param address
 * @returns Returns account label if exists
 */
export function _getAccountName(address: string | solana.PublicKey): string {
    const addr = address instanceof solana.PublicKey ? address.toString() : address;
    const label = accounts.get(addr);
    return label ?? addr;
}