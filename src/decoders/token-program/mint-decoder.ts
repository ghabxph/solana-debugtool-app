import { Connection, PublicKey } from '@solana/web3.js';
import { Decoder } from '../decoder';

class MintDecoder extends Decoder {

    constructor(
        /**
         * Account address
         */
        protected address: string,
    ) { super() }
}
