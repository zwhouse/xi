import {secret} from "../server";
import {CryptoUtils} from "../util/crypto-utils";
import {Request} from "express";

export class CookieJar {

    readonly email: string;

    constructor(email: string) {
        this.email = email;
    }

    encryptedJson(): string {
        return CryptoUtils.encrypt(JSON.stringify(this), secret) as string;
    }

    static from(req: Request): CookieJar {
        const encrypted = req.cookies["xi"];
        const decrypted = CryptoUtils.decrypt(encrypted, secret);
        return JSON.parse(decrypted as string);
    }
}