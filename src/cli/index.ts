import inquirer from 'inquirer';
import { findOffsetFromAccountInfo } from '../util';

inquirer.prompt({
    type: "list",
    name: "action",
    message: "Please choose action",
    choices: [
        "Find solana address from account"
    ]
}).then((answer) => {
    switch(answer.action) {
        case "Find solana address from account":
            findSolanaAddressFromAccount();
            break;
    }
});

async function findSolanaAddressFromAccount() {
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