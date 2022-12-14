import { PublicKey } from '@solana/web3.js';
// import { Decoder } from '../decoder';
import { Decoder2 } from '../decoder2';

export class UserLendRewardAccount extends Decoder2 {

    /**
     * Account info data
     */
    protected data: Buffer = Buffer.alloc(0);

    /**
     * StakeAmount
     */
    get stakeAmount(): Promise<PublicKey> {
        return this.getU64(1);
    }
}
