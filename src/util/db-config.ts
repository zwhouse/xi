export class DbConfig {

    readonly username?: string;
    readonly password?: string;
    readonly host: string;
    readonly port: number;
    readonly database: string;

    constructor(dbUrl: string) {
        const parts = dbUrl.split(/[:\/@]+/);

        if (parts.length === 6) {
            this.username = parts[1];
            this.password = parts[2];
            this.host = parts[3];
            this.port = parseInt(parts[4]);
            this.database = parts[5];
        }
        else if (parts.length === 4) {
            this.username = undefined;
            this.password = undefined;
            this.host = parts[1];
            this.port = parseInt(parts[2]);
            this.database = parts[3];
        }
        else {
            throw new Error(`unexpected DATABASE_URL: ${dbUrl}`);
        }
    }
}
