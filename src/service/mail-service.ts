import * as sg from "@sendgrid/mail";

export class MailService {

    async send(to: string, subject: string,  message: string) {

        sg.setApiKey(process.env.SENDGRID_API_KEY as string);

        await sg.send({
            from: "bkiers+xi@gmail.com",
            to: to,
            subject: subject,
            text: message,
            html: `<p>${message}</p>`
        }).catch(reason => {
            console.error(`couldn't send email: ${reason}`);
        });
    }
}

