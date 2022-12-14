import { BN } from '@project-serum/anchor';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import inquirer from 'inquirer';
import { findOffsetFromAccountInfo } from '../util';
import { U64 } from '../util/numbers/u64';

export async function findAccount() {
    const { address } = await inquirer.prompt([
        {
            type: "input",
            name: "address",
            message: "Solana address to fetch",
        }
    ]);
    const { type } = await inquirer.prompt([
        {
            type: "list",
            name: "type",
            message: "Type of info to find",
            choices: [
                "Public key",
                "u64",
            ]
        }
    ]);
    let response, needle;
    switch (type) {
        case "Public key":
            response = await inquirer.prompt([
                {
                    type: "input",
                    name: "needle",
                    message: "Solana address to find within the account info data",
                }
            ]);
            needle = response.needle;
            break;
        case "u64":
            response = await inquirer.prompt([
                {
                    type: "input",
                    name: "needle",
                    message: "Please enter u64 number",
                }
            ]);
            needle = U64.fromString(response.needle).toBase58();
            break;
    }
    findOffsetFromAccountInfo(address, needle);
}