import { PublicKey } from '@solana/web3.js';
import inquirer from 'inquirer';
import { connection } from '../common';

export async function decodeTransaction() {
    const { signature } = await inquirer.prompt([
        {
            type: "input",
            name: "signature",
            message: "Solana transaction signature to fetch",
            
        }
    ]);
    const tx = await connection.getTransaction(signature);
    const accountKeys = tx?.transaction.message.accountKeys as PublicKey[];
    for (let i = 0; i < accountKeys.length; i++) {
        console.log(`Account ${i + 1}: ${accountKeys[i]}`)
    }
}
