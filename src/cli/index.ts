import { BN } from '@project-serum/anchor';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import inquirer from 'inquirer';
import { init } from '../util';
import { U64 } from '../util/numbers/u64';
import { analyzeTransaction } from './analyze-transaction';
import { decodeAccount } from './decode-account';
import { decodeTransaction } from './decode-transaction';
import { findAccount } from './find-account';

(async () => {

    // Choose endpoint
    const { endpoint } = await inquirer.prompt({
        type: "list",
        name: "endpoint",
        message: "Please choose endpoint",
        choices: [
            "http://127.0.0.1:8899",
            "https://api.mainnet-beta.solana.com",
        ]
    });

    // Initialize app instance
    init(endpoint);

    const { action } = await inquirer.prompt({
        type: "list",
        name: "action",
        message: "Please choose action",
        choices: [
            "Analyze an account",
            "Decode known solana account",
            "Decode transaction",
            "Analyze transaction",
        ]
    });
    switch(action) {
        case "Analyze an account":
            await findAccount();
            break;
        case "Decode known solana account":
            await decodeAccount();
            break;
        case "Decode transaction":
            await decodeTransaction();
            break;
        case "Analyze transaction":
            await analyzeTransaction();
            break;
    }
})();
