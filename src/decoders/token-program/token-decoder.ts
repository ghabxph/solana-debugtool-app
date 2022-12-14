import { Connection, PublicKey } from '@solana/web3.js';
import { Decoder } from '../decoder';
import { BN } from "@project-serum/anchor";

export class TokenDecoder extends Decoder {

    constructor(
        /**
         * Account address
         */
        protected address: string,
    ) { super() }

    /**
     * Get token mint
     */
    get mint(): Promise<PublicKey> {
        return this.getPublicKey(0);
    }

    /**
     * Get token owner
     */
    get owner(): Promise<PublicKey> {
        return this.getPublicKey(32);
    }

    /**
     * Get token amount
     */
    get amount(): Promise<BN> {
        return this.getU64(64);
    }
}
