import { PublicKey } from "@solana/web3.js";
import { Decoder } from "../../decoders/decoder";

export class StakePoolAccount extends Decoder {

    constructor(
        /**
         * Account address
         */
        protected address: string,
    ) { super() }

    /**
     * Get derived lending market authority
     */
    get lendingMarketAuthority(): Promise<PublicKey> {
        return this.getPublicKey(1)
    }
}
