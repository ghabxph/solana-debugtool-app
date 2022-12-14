import { PublicKey } from "@solana/web3.js";
import { Decoder } from "../../decoders/decoder";

export class StakeAccount extends Decoder {

    constructor(
        /**
         * Account address
         */
        protected address: string,
    ) { super() }

    /**
     * Get obligation owner address
     */
    get obligationOwner(): Promise<PublicKey> {
        return this.getPublicKey(17)
    }
}
