import { BN } from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { IntegerOverflow, NumberCannotBeNegative } from "./errors";

export class U64 {

    /**
     * Little-endian representation of number
     */
    readonly buffer: Buffer = Buffer.alloc(8);

    /**
     * Return base-58 encoding of this number in little-endian order
     *
     * @returns
     */
    toBase58(): string {
        return bs58.encode(this.buffer);
    }

    /**
     * Number from native javascript number type
     *
     * @param number
     */
    static fromNumber(number: number): U64 {

        // Throw an error if number input is negative
        if (number < 0) {
            throw new NumberCannotBeNegative();
        }

        // Convert number to buffer
        const buffer = this.numberToBuffer(number);

        // Throw integer overflow error when number of bytes exceed 8
        if (buffer.length > 8) throw new IntegerOverflow();

        // Return the u64 number ordered to little endian
        return U64.toLittleEndian(buffer);
    }

    /**
     * Number from string
     *
     * @param number
     */
    static fromString(number: string): U64 {

        // TODO: How to check that number is negative?
        // We can using negative "-" character??
        // // Throw an error if number input is negative
        // if (number < 0) {
        //     throw new NumberCannotBeNegative();
        // }

        // Convert string number to buffer
        const buffer = this.strNumberToBuffer(number);

        // Throw integer overflow error when number of bytes exceed 8
        if (buffer.length > 8) throw new IntegerOverflow();

        // Return the u64 number ordered to little endian
        return U64.toLittleEndian(buffer);
    }

    /**
     * Convert to 8-bit little endian
     *
     * @param buffer
     */
    private static toLittleEndian(buffer: Buffer): U64 {

        // New u64 instance
        const u64 = new U64;

        // Convert number to little endian
        for (let i = 0; i < 8; i++) {
            const index = buffer.length - 1 - i;
            u64.buffer[i] = index >= 0 ? buffer[index] : 0x00;
        }

        // Return u64 instance
        return u64;
    }

    /**
     * Convert number to buffer
     *
     * @param number
     */
    private static numberToBuffer(number: number): Buffer {

        // TODO: Should find a way to not use anchor's BN.
        return new BN(number).toBuffer();
    }

    /**
     * Convert string number to buffer
     *
     * @param number
     */
    private static strNumberToBuffer(number: string): Buffer {

        // TODO: Should find a way to not use anchor's BN.
        return new BN(number).toBuffer();
    }
}
