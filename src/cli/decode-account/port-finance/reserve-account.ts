import { Connection, PublicKey } from '@solana/web3.js';
import inquirer from 'inquirer';
import { Decoder } from '../../../decoders/decoder';

class ReserveAccount extends Decoder {

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

export async function reserveAccount() {
    const { address } = await inquirer.prompt([
        {
            type: "input",
            name: "address",
            message: "Solana address to fetch",
            
        }
    ]);

    const account = new ReserveAccount(address);
    console.log(``);
    console.log(`reserveLiquiditySupply: ${await account.reserveLiquiditySupply}`);
    console.log(`reserveCollateralMint: ${await account.reserveCollateralMint}`);
    console.log(`lendingMarketAccount: ${await account.lendingMarketAccount}`);
    console.log(`destinationCollateral: ${await account.destinationCollateral}`);
    console.log(`stakingPool: ${await account.stakingPool}`);
    console.log(`liquidityOracle: ${await account.liquidityOracle}`);
    console.log(``);
}