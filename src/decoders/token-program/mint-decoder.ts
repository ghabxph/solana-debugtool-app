import { Connection, PublicKey } from '@solana/web3.js';
import { connection as defaultConnection } from '../../common';
import { Decoder } from '../decoder';

class MintDecoder extends Decoder {

    constructor(
        /**
         * Account address
         */
        protected address: string,

        /**
         * Connection instance
         */
        protected connection: Connection = defaultConnection,
    ) { super() }
}
