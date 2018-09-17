import * as crypto from 'crypto';

export class CryptoUtils {

    // https://gist.github.com/AndiDittrich/4629e7db04819244e843
    static decrypt(textBase64: string, secret: string): string | undefined {
        try {
            const bData = Buffer.from(textBase64, 'base64');

            const salt = bData.slice(0, 64);
            const iv = bData.slice(64, 80);
            const tag = bData.slice(80, 96);
            const text = bData.slice(96);

            const key = crypto.pbkdf2Sync(secret, salt, 2145, 32, 'sha512');
            const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

            decipher.setAuthTag(tag);

            return decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
        }
        catch (e) {
            return undefined;
        }
    }

    // https://gist.github.com/AndiDittrich/4629e7db04819244e843
    static encrypt(text: string, secret: string): string | undefined {
        try {
            const iv = crypto.randomBytes(16);
            const salt = crypto.randomBytes(64);

            const key = crypto.pbkdf2Sync(secret, salt, 2145, 32, 'sha512');
            const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

            const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
            const tag = cipher.getAuthTag();

            return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
        }
        catch (e) {
            return undefined;
        }
    }
}
