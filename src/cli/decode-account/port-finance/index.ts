import inquirer from 'inquirer';
import { reserveAccount } from './reserve-account';

export async function portFinance() {
    const answer = await inquirer.prompt({
        type: "list",
        name: "action",
        message: "What account do you want to decode in Port Finance?",
        choices: [
            "Reserve account",
            "Stake account",
        ]
    });
    switch(answer.action) {
        case "Reserve account":
            reserveAccount()
            break;
    }
}