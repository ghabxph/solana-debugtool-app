import { Connection, PublicKey } from "@solana/web3.js";
import { Decoder } from "../../../decoders/decoder";
import inquirer from "inquirer";

class StakeAccount extends Decoder {

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

export async function stakeAccount() {
    const { address } = await inquirer.prompt([
        {
            type: "input",
            name: "address",
            message: "Solana address to fetch",
            
        }
    ]);

    const account = new StakeAccount(address);
    // console.log(``);
    // console.log(`reserveLiquiditySupply: ${await account.reserveLiquiditySupply}`);
    // console.log(`reserveCollateralMint: ${await account.reserveCollateralMint}`);
    // console.log(`lendingMarketAccount: ${await account.lendingMarketAccount}`);
    // console.log(`destinationCollateral: ${await account.destinationCollateral}`);
    // console.log(`stakingPool: ${await account.stakingPool}`);
    // console.log(``);
}