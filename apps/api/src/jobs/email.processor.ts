import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process('send-notification')
  async handleNotificationEmail(job: Job) {
    this.logger.debug(`Sending notification email to ${job.data.to}...`);

    // Stub: Setup AWS SES or SMTP transport
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.debug(`Email sent to ${job.data.to}`);
  }
}
