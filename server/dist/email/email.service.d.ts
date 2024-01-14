import { Transporter } from 'nodemailer';
export declare class EmailService {
    transporter: Transporter;
    constructor();
    sendMail({ to, subject, html }: {
        to: any;
        subject: any;
        html: any;
    }): Promise<void>;
}
