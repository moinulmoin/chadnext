import { generateEmailVerificationCode } from "~/actions/auth";
import { sendOTP } from "~/actions/mail";
import { siteUrl } from "~/config/site";
import db from "~/lib/db";

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

    const otp = await generateEmailVerificationCode(user.id, body.email);
    await sendOTP({
      toMail: body.email,
      code: otp,
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
