import * as solana from "@solana/web3.js";
import { connection } from "./common";
import fs from 'fs';

export async function getAccountInfo(address: string, cache: boolean = true): Promise<solana.AccountInfo<Buffer>> {
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
export async function findOffsetFromAccountInfo(address: string, needle: string) {
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