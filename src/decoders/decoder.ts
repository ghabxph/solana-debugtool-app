import * as solana from "@solana/web3.js";
import { getAccountInfo } from "../util";
import { BN } from "@project-serum/anchor";

export abstract class Decoder {

    /**
     * Account info data
     */
    private _data: Uint8Array = new Uint8Array();

    /**
     * Account address
     */
    protected abstract address: string;

    /**
     * Connection instance
     */
    protected abstract connection: solana.Connection;

    /**
     * Account info data
     */
    protected get data(): Promise<Uint8Array> {
        if (this._data.length === 0) {
            console.log(`Decoding ${this.address} account`);
            return getAccountInfo(this.address, this.connection).then(info => {
                if (info?.data !== undefined) {
                    console.log(`Success. Account size: ${info?.data.length}\n`);
                    this._data = new Uint8Array(info.data);
                    return this._data;
                }
                console.log(`Account not initialized.`);
                return new Uint8Array();
            });
        }
        return Promise.resolve(this._data);
    }

    /**
     * Get public key starting from given offset
     *
     * @param offset Offset of public key
     * @returns 
     */
    protected async getPublicKey(offset: number): Promise<solana.PublicKey> {
        const data = await this.data;
        if (offset + 32 >= data.length) {
            throw Error(`Offset exceeded account info data size: ${offset + 32} > ${data.length}`);
        }
        return new solana.PublicKey(data.subarray(offset, offset + 32));
    }

    /**
     * Get unsigned integer (64-bytes) starting from given offset
     *
     * @param offset
     */
    protected async getU64(offset: number): Promise<BN> {
        const data = await this.data;
        if (offset + 32 >= data.length) {
            throw Error(`Offset exceeded account info data size: ${offset + 32} > ${data.length}`);
        }
        return new BN(data.subarray(offset, offset + 8), 'le')
    }

    /**
     * Override account data
     *
     * @param data Account data
     */
    setData(data: Uint8Array) {
        this._data = data;
    }
}
