import inquirer from 'inquirer';
import { decodeAccount } from './decode-account';
import { decodeTransaction } from './decode-transaction';
import { findAccount } from './find-account';

inquirer.prompt({
    type: "list",
    name: "action",
    message: "Please choose action",
    choices: [
        "Find solana address from account",
        "Decode known solana account",
        "Decode transaction",
    ]
}).then((answer) => {
    switch(answer.action) {
        case "Find solana address from account":
            findAccount();
            break;
        case "Decode known solana account":
            decodeAccount();
            break;
        case "Decode transaction":
            decodeTransaction();
            break;
    }
});
