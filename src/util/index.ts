import * as solana from "@solana/web3.js";
import { connection as defaultConnection } from "../common";
import { _findOffsetFromAccountInfo, _getAccountInfo, _getAccountName } from "./account-info";

/**
 * Get account info. Once downloaded, it'll be cached. Setting cache parameter to false
 * will re-download the latest account info from the blockchain.
 *
 * @param address Account to fetch
 * @returns Returns the account info, or will throw an error if account does not exist.
 */
export async function getAccountInfo(address: string): Promise<solana.AccountInfo<Buffer>>;

/**
 * Get account info. Once downloaded, it'll be cached. Setting cache parameter to false
 * will re-download the latest account info from the blockchain.
 *
 * @param address Account to fetch
 * @param connection Solana connection instance to use
 * @returns Returns the account info, or will throw an error if account does not exist.
 */
export async function getAccountInfo(address: string, connection: solana.Connection): Promise<solana.AccountInfo<Buffer>>;

/**
 * Get account info. Once downloaded, it'll be cached. Setting cache parameter to false
 * will re-download the latest account info from the blockchain.
 *
 * @param address Account to fetch
 * @param cache Whether fetch from cache
 * @param connection Solana connection instance to use
 * @returns Returns the account info, or will throw an error if account does not exist.
 */
export async function getAccountInfo(address: string, connection: solana.Connection, cache: boolean): Promise<solana.AccountInfo<Buffer>>;

/**
 * Get account info. Once downloaded, it'll be cached. Setting cache parameter to false
 * will re-download the latest account info from the blockchain.
 *
 * @param address Account to fetch
 * @param cache Whether fetch from cache
 * @param connection Solana connection instance to use
 * @returns Returns the account info, or will throw an error if account does not exist.
 */
export async function getAccountInfo(address: string, connection: solana.Connection = defaultConnection, cache: boolean = true): Promise<solana.AccountInfo<Buffer>> {
    return _getAccountInfo(address, connection, cache);
}

/**
 * Find the offset of base58-encoded bytes from account info data of given account address.
 *
 * @param address Address of account to fetch
 * @param needle Base58-encoded bytes to find
 */
export async function findOffsetFromAccountInfo(address: string, needle: string): Promise<void> {
    return _findOffsetFromAccountInfo(address, needle);
}

/**
 * Returns the name of given account that is known by us.
 *
 * @param address Address in string
 */
export function getAccountName(address: string): string;

/**
 * Returns the name of given account that is known by us.
 *
 * @param address Address in public key form
 */
export function getAccountName(address: solana.PublicKey): string;

/**
 * Returns the name of given account that is known by us.
 *
 * @param address
 */
export function getAccountName(address: string | solana.PublicKey): string {
    return _getAccountName(address);
}