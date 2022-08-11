import * as solana from "@solana/web3.js";
import { AccountInfo } from "@solana/web3.js";
import { connection } from "../common";

export abstract class Decoder {

    /**
     * Account info data
     */
    private _data: Uint8Array = new Uint8Array();

    /**
     * Account address
     */
    protected abstract address: solana.PublicKey;

    /**
     * Connection instance
     */
    protected abstract connection: solana.Connection;

    /**
     * Account info data
     */
    protected get data(): Promise<Uint8Array> {
        if (this._data === null) {
            return this.connection.getAccountInfo(this.address).then(info => {
                if (info?.data !== undefined) {
                    this._data = info.data;
                }
                return new Uint8Array();
            });
        } else {
            return Promise.resolve(new Uint8Array());
        }
    }

    /**
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
}
