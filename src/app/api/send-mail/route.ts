import { NextResponse } from "next/server";
import { type ReactElement } from "react";
import { Resend } from "resend";
import EmailTemplate from "~/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Data {
  to: string;
  from: string;
  subject: string;
  react: ReactElement;
}

export async function POST(req: Request) {
  const { email, name } = await req.json();
  try {
    const data = await resend.sendEmail({
      from: `ChadNext <hello@chadnext.moinulmoin.com>`,
      to: email,
      subject: "Thank you for signing up!",
      react: EmailTemplate({ userName: name }),
    } as Data);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
