import { PublicKey } from '@solana/web3.js';
import { Decoder } from '../decoder';

export class ReserveAccount extends Decoder {

    constructor(
        /**
         * Account address
         */
        protected address: string,
    ) { super() }

    /**
     * Reserve liquidity supply address
     */
    get reserveLiquiditySupply(): Promise<PublicKey> {
        return this.getPublicKey(75);
    }

    /**
     * Reserve collateral mint address
     */
    get reserveCollateralMint(): Promise<PublicKey> {
        return this.getPublicKey(231);
    }

    /**
     * Lending market account address
     */
    get lendingMarketAccount(): Promise<PublicKey> {
        return this.getPublicKey(10);
    }

    /**
     * Destination collateral address
     */
    get destinationCollateral(): Promise<PublicKey> {
        return this.getPublicKey(271);
    }

    /**
     * Staking pool address
     */
    get stakingPool(): Promise<PublicKey> {
        return this.getPublicKey(328);
    }

    /**
     * Get optional liquidity oracle public key
     */
     get liquidityOracle(): Promise<PublicKey> {
        return this.getPublicKey(143);
    }
}
