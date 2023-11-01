import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EmailBodyDto } from 'src/auth/dto/email-body-dto';

@Injectable()
export class ManagersService {
  // constructor(private readonly postsService: PostsService) {}

  async sendEmailConfirmationMessage(emailObject: EmailBodyDto): Promise<any> {
    // ==========
    console.log('11++managers.serv', emailObject);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'andreiincubator@gmail.com',
        pass: 'uggx ujbd rsfr zzun',
      },
    });
    console.log('18++managers.serv');

    async function main() {
      const info = await transporter.sendMail({
        from: 'andreiincubator@gmail.com', // sender address
        to: emailObject.email, // list of receivers
        subject: emailObject.subject, // Subject line
        // text: 'Hello world?', // plain text body
        html: emailObject.message, // html body
      });

      return info;
    }
    console.log('30++managers.serv');

    return await main().catch(console.error);
  }
}
