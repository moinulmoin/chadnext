import db from "~/lib/db";
import { sendVerificationEmail } from "~/lib/resend";
import { appUrl } from "~/lib/utils";
import { createEmailVerificationToken } from "~/server/auth";

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    const user = await db.user.upsert({
      where: {
        email: body.email,
      },
      update: {},
      create: {
        email: body.email,
        emailVerified: false,
      },
    });

    const verificationToken = await createEmailVerificationToken(
      user.id,
      body.email
    );
    const verificationUrl =
      appUrl + "/api/auth/email-verify?token=" + verificationToken;
    await sendVerificationEmail({
      toMail: body.email,
      verificationUrl,
      userName: user.name?.split(" ")[0] || "",
    });

    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new Response(null, {
      status: 500,
    });
  }
};
