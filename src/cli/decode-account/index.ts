import inquirer from 'inquirer';
import { portFinance } from './port-finance';

export async function decodeAccount() {
    const answer = await inquirer.prompt({
        type: "list",
        name: "action",
        message: "What account do you want to decode?",
        choices: [
            "Port finance"
        ]
    });
    switch(answer.action) {
        case "Port finance":
            portFinance();
            break;
    }
}