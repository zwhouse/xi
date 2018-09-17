import * as sg from "@sendgrid/mail";

export class MailService {

    constructor() {
        sg.setApiKey(process.env.SENDGRID_API_KEY as string);
    }

    async send(from: string,  to: string, subject: string,  message: string) {
        await sg.send({
            from: from,
            to: to,
            subject: subject,
            text: message,
            html: `<p>${message}</p>`
        });
    }
}

