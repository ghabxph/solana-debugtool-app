import { Connection, PublicKey } from "@solana/web3.js";
import { Decoder } from "../../../decoders/decoder";
import { connection as defaultConnection } from '../../../common';
import inquirer from "inquirer";

class StakePoolAccount extends Decoder {

    constructor(
        /**
         * Account address
         */
        protected address: string,

        /**
         * Connection instance
         */
        protected connection: Connection = defaultConnection,
    ) { super() }

    /**
     * Get derived lending market authority
     */
    get lendingMarketAuthority(): Promise<PublicKey> {
        return this.getPublicKey(1)
    }
}

export async function stakePoolAccount() {
    const { address } = await inquirer.prompt([
        {
            type: "input",
            name: "address",
            message: "Solana address to fetch",
            
        }
    ]);

    const account = new StakePoolAccount(address);
    console.log(``);
    console.log(`lendingMarketAuthority: ${await account.lendingMarketAuthority}`);
    console.log(``);
}