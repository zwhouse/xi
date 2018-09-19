import {secret} from "../server";
import {CryptoUtils} from "../util/crypto-utils";
import {Request} from "express";

export class CookieJar {

    email: string;
    redirectTo: string;

    constructor(email: string, redirectTo: string = "") {
        this.email = email;
        this.redirectTo = redirectTo;
    }

    isLoggedIn(): boolean {
        return this.email !== "";
    }

    encryptedJson(): string {
        return CryptoUtils.encrypt(JSON.stringify(this), secret) as string;
    }

    static from(req: Request): CookieJar {
        if (req.cookies["xi"] === undefined) {
            return new CookieJar("", "");
        }
        const encrypted = req.cookies["xi"];
        const decrypted = CryptoUtils.decrypt(encrypted, secret);
        const obj = JSON.parse(decrypted as string);
        return new CookieJar(obj["email"] || "", obj["redirectTo"] || "");
    }
}