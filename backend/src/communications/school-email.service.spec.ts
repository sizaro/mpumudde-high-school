import { ConfigService } from "@nestjs/config";
import { SchoolEmailService } from "./school-email.service.js";

describe("SchoolEmailService", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("sends through Brevo's HTTPS API when the Brevo transport is selected", async () => {
    const config = {
      get: jest.fn(
        (key: string) =>
          ({
            EMAIL_TRANSPORT: "brevo",
            BREVO_API_KEY: "test-key",
            EMAIL_FROM_ADDRESS: "mpumuddehighschoolupdates@gmail.com",
            EMAIL_FROM_NAME: "Mpumudde High School",
          })[key],
      ),
    } as unknown as ConfigService;
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 201 });
    global.fetch = fetchMock as unknown as typeof fetch;

    const service = new SchoolEmailService(config);
    await expect(
      service.sendEmail({
        to: "alumnus@example.com",
        subject: "Confirm your registration",
        text: "Use this link.",
        html: "<p>Use this link.</p>",
      }),
    ).resolves.toEqual({ status: "SENT" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/smtp/email",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "api-key": "test-key" }),
      }),
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(
      expect.objectContaining({
        sender: {
          email: "mpumuddehighschoolupdates@gmail.com",
          name: "Mpumudde High School",
        },
        to: [{ email: "alumnus@example.com" }],
        subject: "Confirm your registration",
        textContent: "Use this link.",
        htmlContent: "<p>Use this link.</p>",
      }),
    );
  });

  it("does not fall back to SMTP when Brevo is selected but its key is absent", async () => {
    const config = {
      get: jest.fn(
        (key: string) =>
          ({
            EMAIL_TRANSPORT: "brevo",
            EMAIL_FROM_ADDRESS: "mpumuddehighschoolupdates@gmail.com",
          })[key],
      ),
    } as unknown as ConfigService;

    const service = new SchoolEmailService(config);
    await expect(
      service.sendTextEmail({
        to: "alumnus@example.com",
        subject: "Confirm your registration",
        text: "Use this link.",
      }),
    ).resolves.toEqual({
      status: "NOT_CONFIGURED",
      error: "Brevo email delivery is not configured for this school.",
    });
  });
});
