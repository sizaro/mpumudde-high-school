import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type EmailDeliveryResult = {
  status: 'SENT' | 'FAILED' | 'NOT_CONFIGURED';
  error?: string;
};

/**
 * Deliberate, small email boundary. The school can use Resend by configuring
 * RESEND_API_KEY and EMAIL_FROM, while contact/verification records remain
 * useful even when an email provider has not been configured yet.
 */
@Injectable()
export class SchoolEmailService {
  private readonly logger = new Logger(SchoolEmailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendTextEmail(input: {
    to: string;
    subject: string;
    text: string;
  }): Promise<EmailDeliveryResult> {
    const apiKey = this.config.get<string>('RESEND_API_KEY')?.trim();
    const from = this.config.get<string>('EMAIL_FROM')?.trim();
    if (!apiKey || !from) {
      return {
        status: 'NOT_CONFIGURED',
        error: 'Email delivery is not configured for this school.',
      };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to: input.to, subject: input.subject, text: input.text }),
      });
      if (response.ok) return { status: 'SENT' };

      const body = await response.text();
      const error = `Email provider rejected the request (${response.status}). ${body}`.slice(0, 500);
      this.logger.warn(error);
      return { status: 'FAILED', error };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown email delivery error.';
      this.logger.error(`Unable to send email: ${message}`);
      return { status: 'FAILED', error: message.slice(0, 500) };
    }
  }
}
