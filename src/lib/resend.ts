import { nanoid } from "nanoid";
import { Resend } from "resend";
import { type CreateEmailOptions } from "resend/build/src/emails/interfaces";
import { ThanksTemp } from "~/components/email-template/thanks";
import { VerificationTemp } from "~/components/email-template/verification";

export const resend = new Resend(process.env.RESEND_API_KEY);

interface SendMailProps {
  toMail: string;
  type: "verification" | "new-signin";
  data: {
    name: string;
    url?: string;
  };
}

export const sendMail = async ({ toMail, type, data }: SendMailProps) => {
  let subject;
  let reactEl;
  if (type === "verification") {
    subject = "Sign In link for ChadNext";
    reactEl = VerificationTemp({
      userName: data.name,
      verificationUrl: data.url as string,
    });
  } else if (type === "new-signin") {
    subject = "Thanks for signing in!";
    reactEl = ThanksTemp({ userName: data.name });
  }

  try {
    await resend.sendEmail({
      from: `ChadNext App <chadnext@moinulmoin.com>`,
      to: toMail,
      subject: subject,
      react: reactEl,
      headers: {
        "X-Entity-Ref-ID": nanoid(),
      },
    } as CreateEmailOptions);
  } catch (error) {
    console.error(error);
  }
};
