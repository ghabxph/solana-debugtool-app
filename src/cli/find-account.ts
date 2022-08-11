import inquirer from 'inquirer';
import { findOffsetFromAccountInfo } from '../util';

export async function findAccount() {
    const { address, needle } = await inquirer.prompt([
        {
            type: "input",
            name: "address",
            message: "Solana address to fetch",
        },
        {
            type: "input",
            name: "needle",
            message: "Solana address to find within the account info data",
        }
    ])
    findOffsetFromAccountInfo(address, needle);
}