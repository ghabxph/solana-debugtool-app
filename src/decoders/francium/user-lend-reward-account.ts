import * as anchor from "@project-serum/anchor";
import { Decoder2 } from '../decoder2';

export class UserLendRewardAccount extends Decoder2<UserLendRewardAccount> {

    /**
     * Account info data
     */
    protected data: Buffer = Buffer.alloc(0);

    /**
     * StakeAmount
     */
    get stakeAmount(): anchor.BN {
        return this.getU64(1);
    }
}
