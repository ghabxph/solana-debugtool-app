import * as anchor from "@project-serum/anchor";
import * as solana from "@solana/web3.js";
import { getAccountInfo } from "../util";

const typeSize = {
    bool:      1,    // 1 byte as boolean
    u8:        1,    // 1 byte as unsigned integer
    u16:       2,    // 2 byte as unsigned integer
    u64:       8,    // 8 byte as unsigned integer
    u128:      16,   // 16 byte as unsigned integer
    i64:       8,    // 8 byte as signed integer
    PublicKey: 32,   // 32 bytes as anchor.web3.PublicKey
    BN:        8,    // 8 bytes as anchor.BN
    Blob8:     8,    // 8 bytes as Uint8Array(8)
    Blob32:    32,   // 32 bytes as Uint8Array(32)
    Blob128:   128,  // 128 bytes as Uint8Array(128)
    Blob230:   230,  // 230 bytes as Uint8Array(128)
};

export abstract class Decoder2<Child> {

    /**
     * Account info data
     */
    protected data: Buffer = Buffer.alloc(0);

    /**
     * Get public key starting from given offset
     *
     * @param offset Offset of public key
     * @returns 
     */
    protected getPublicKey(offset: number): solana.PublicKey {
        const data = this.data;
        const size = typeSize.PublicKey;
        if (offset + size >= data.length) {
            throw Error(`Offset exceeded account info data size: ${offset + size} > ${data.length}`);
        }
        return new solana.PublicKey(data.subarray(offset, offset + size));
    }

    /**
     * Gets boolean value from given offset
     *
     * @param offset
     */
    protected getBool(offset: number): boolean {
        const value = this.getU8(offset);
        if (value > 1) {
            throw Error(`Value is not boolean: ${value}`);
        }
        return value === 1;
    }

    /**
     * Gets unsigned integer (1-byte) starting from given offset
     *
     * @param offset
     */
    protected getU8(offset: number): number {
        const data = this.data;
        const size = typeSize.u8;
        if (offset + size >= data.length) {
            throw Error(`Offset exceeded account info data size: ${offset + size} > ${data.length}`);
        }
        const value = data.subarray(offset, offset + size)[0];
        return value;
    }

    /**
     * Get unsigned integer (2-bytes) starting from given offset
     *
     * @param offset
     */
    protected getU16(offset: number): number {
        const data = this.data;
        const size = typeSize.u16;
        if (offset + size >= data.length) {
            throw Error(`Offset exceeded account info data size: ${offset + size} > ${data.length}`);
        }
        return new anchor.BN(data.subarray(offset, offset + size), 'le').toNumber();
    }

    /**
     * Get unsigned integer (64-bytes) starting from given offset
     *
     * @param offset
     */
    protected getU64(offset: number): anchor.BN {
        const data = this.data;
        const size = typeSize.u64;
        if (offset + size >= data.length) {
            throw Error(`Offset exceeded account info data size: ${offset + size} > ${data.length}`);
        }
        return new anchor.BN(data.subarray(offset, offset + size), 'le');
    }

    /**
     * Get unsigned integer (64-bytes) starting from given offset
     *
     * @param offset
     */
    protected getU128(offset: number): anchor.BN {
        const data = this.data;
        const size = typeSize.u128;
        if (offset + size >= data.length) {
            throw Error(`Offset exceeded account info data size: ${offset + size} > ${data.length}`);
        }
        return new anchor.BN(data.subarray(offset, offset + size), 'le');
    }

    /**
     * Set account info from raw buffer
     *
     * @param data Account data
     */
    static fromBuffer<Child extends Decoder2<Child>>(data: Buffer, child: Child): Child {
        child.data = data;
        return child;
    }

    /**
     * Create instance of decoder from given address
     *
     * @param address
     */
    static async fromAddress<Child extends Decoder2<Child>>(address: string, child: Child): Promise<Child> {
        const info = await getAccountInfo(address);
        child.data = info.data;
        return child;
    }

    /**
     * Create instance of decoder from given address
     *
     * @param address Public key address (as base58 string)
     */
    async fromAddress<Child extends Decoder2<Child>>(this: Child, address: anchor.web3.PublicKey): Promise<Child>;

    /**
     * Create instance of decoder from given address
     *
     * @param address Public key instance
     */
    async fromAddress<Child extends Decoder2<Child>>(this: Child, address: string): Promise<Child>;

    /**
     * Create instance of decoder from given address
     *
     * @param address (see overload)
     */
    async fromAddress<Child extends Decoder2<Child>>(this: Child, address: anchor.web3.PublicKey | string): Promise<Child> {
        const _address = typeof address === 'string' ? new anchor.web3.PublicKey(address) : address;
        const info = await getAccountInfo(_address.toString());
        this.data = info!.data;
        return this;
    }
}
