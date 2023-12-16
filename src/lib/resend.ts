import ThanksTemp from "emails/thanks";
import { nanoid } from "nanoid";
import { Resend } from "resend";
import { type SendMailProps } from "~/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({ toMail, data }: SendMailProps) => {
  const subject = "Thanks for using ChadNext!";
  const temp = ThanksTemp({ userName: data.name });

  //@ts-expect-error text field is required
  await resend.emails.send({
    from: `ChadNext App <chadnext@moinulmoin.com>`,
    to: toMail,
    subject: subject,
    headers: {
      "X-Entity-Ref-ID": nanoid(),
    },
    react: temp,
  });
};
