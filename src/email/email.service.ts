import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('SMTP_SERVER_HOST'),
      port: this.configService.get('SMTP_SERVER_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_SERVER_USER'),
        pass: this.configService.get('SMTP_SERVER_PASS'),
      },
    });
  }
  // todo 发送邮件
  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: '2280496040@qq.com',
      },
      to,
      subject,
      html,
    });
  }
}
