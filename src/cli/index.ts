import inquirer from 'inquirer';
import { decodeAccount } from './decode-account';
import { findAccount } from './find-account';

inquirer.prompt({
    type: "list",
    name: "action",
    message: "Please choose action",
    choices: [
        "Find solana address from account",
        "Decode known solana account"
    ]
}).then((answer) => {
    switch(answer.action) {
        case "Find solana address from account":
            findAccount();
            break;
        case "Decode known solana account":
            decodeAccount();
            break;
    }
});
