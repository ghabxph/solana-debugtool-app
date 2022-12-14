import { PublicKey } from '@solana/web3.js';
import { Decoder } from '../decoder';

export class UserLendRewardAccount extends Decoder {

    constructor(
        /**
         * Account address
         */
        protected address: string,
    ) { super() }

    /**
     * StakeAmount
     */
    get stakeAmount(): Promise<PublicKey> {
        return this.getU64(1);
    }
}
