import {CryptoUtils} from "../util/crypto-utils";
import {secret} from "../server";

export class DrawProposal {

    readonly email: string;
    readonly code: string;

    constructor(email: string, code: string) {
        this.email = email;
        this.code = code;
    }

    static decrypt(encrypted: string): DrawProposal {
        const decrypted = CryptoUtils.decrypt(encrypted, secret) as string;
        const obj = JSON.parse(decrypted as string);
        return new DrawProposal(obj["email"] || "", obj["code"] || "");
    }

    encrypt(): string {
        return CryptoUtils.encrypt(JSON.stringify(this), secret) as string;
    }
}