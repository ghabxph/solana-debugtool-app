import { StakePoolAccount } from "../../../decoders/port-finance/stake-pool-account";
import inquirer from "inquirer";

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