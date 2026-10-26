import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

export type EmailDeliveryResult = {
  status: "SENT" | "FAILED" | "NOT_CONFIGURED";
  error?: string;
};

type EmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

@Injectable()
export class SchoolEmailService {
  private readonly logger = new Logger(SchoolEmailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendTextEmail(
    input: Omit<EmailInput, "html">,
  ): Promise<EmailDeliveryResult> {
    return this.sendEmail(input);
  }

  async sendEmail(input: EmailInput): Promise<EmailDeliveryResult> {
    if (
      this.config.get<string>("EMAIL_TRANSPORT")?.trim().toLowerCase() ===
      "brevo"
    ) {
      return this.sendWithBrevo(input);
    }

    return this.sendWithGmailSmtp(input);
  }

  private async sendWithBrevo(input: EmailInput): Promise<EmailDeliveryResult> {
    const apiKey = this.config.get<string>("BREVO_API_KEY")?.trim();
    const fromEmail = this.config.get<string>("EMAIL_FROM_ADDRESS")?.trim();
    const fromName =
      this.config.get<string>("EMAIL_FROM_NAME")?.trim() ||
      "Mpumudde High School";

    if (!apiKey || !fromEmail) {
      return {
        status: "NOT_CONFIGURED",
        error: "Brevo email delivery is not configured for this school.",
      };
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: fromEmail, name: fromName },
          to: [{ email: input.to }],
          subject: input.subject,
          textContent: input.text,
          ...(input.html ? { htmlContent: input.html } : {}),
        }),
        signal: AbortSignal.timeout(20_000),
      });

      if (!response.ok) {
        this.logger.error(
          `Brevo rejected email delivery with HTTP ${response.status}.`,
        );
        return {
          status: "FAILED",
          error: "The school email provider could not accept this message.",
        };
      }

      return { status: "SENT" };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown email delivery error.";
      this.logger.error(`Unable to reach Brevo email delivery: ${message}`);
      return {
        status: "FAILED",
        error:
          "Unable to reach the school email provider. Please try again shortly.",
      };
    }
  }

  private async sendWithGmailSmtp(
    input: EmailInput,
  ): Promise<EmailDeliveryResult> {
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
        auth: { user, pass: appPassword },
      });
      await transporter.sendMail({
        from: user,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      });
      return { status: "SENT" };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown email delivery error.";
      this.logger.error(`Unable to send Gmail SMTP email: ${message}`);
      return { status: "FAILED", error: message.slice(0, 500) };
    }
  }
}
