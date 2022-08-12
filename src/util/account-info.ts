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
 */
 export async function _findOffsetFromAccountInfo(address: string, needle: string): Promise<void> {
    const accountInfo = await getAccountInfo(address);
    for (let i = 0; i < accountInfo.data.length; i++) {
        const raw = accountInfo?.data.subarray(i, i + 32);
        const guess = new solana.PublicKey(raw);
        console.log(`index: ${i} -- Finding: ${needle} -- ${guess}`);
        if (needle === guess.toString()) {
            console.log(`Match at ${i}!`);
            return;
        }
    }
}