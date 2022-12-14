import { ReserveAccount } from '../../../decoders/port-finance/reserve-account';
import inquirer from 'inquirer';

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