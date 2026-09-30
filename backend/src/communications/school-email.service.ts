import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

export type EmailDeliveryResult = {
  status: "SENT" | "FAILED" | "NOT_CONFIGURED";
  error?: string;
};

/**
 * Deliberate, small email boundary.
 *
 * Gmail is used as the school's current email provider through
 * a Google App Password. The rest of the application does not
 * need to know which provider is being used.
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
    const user = this.config.get<string>("GMAIL_USER")?.trim();
    const appPassword = this.config.get<string>("GMAIL_APP_PASSWORD")?.trim();

    if (!user || !appPassword) {
      return {
        status: "NOT_CONFIGURED",
        error: "Email delivery is not configured for this school.",
      };
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user,
          pass: appPassword,
        },
      });

      await transporter.sendMail({
        from: user,
        to: input.to,
        subject: input.subject,
        text: input.text,
      });

      return { status: "SENT" };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown email delivery error.";

      this.logger.error(`Unable to send email: ${message}`);

      return {
        status: "FAILED",
        error: message.slice(0, 500),
      };
    }
  }
}
