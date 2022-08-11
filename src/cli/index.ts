import inquirer from 'inquirer';
import { findAccount } from './find-account';

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
            findAccount();
            break;
    }
});
