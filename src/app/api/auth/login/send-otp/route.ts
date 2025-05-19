import { generateEmailVerificationCode } from "~/lib/server/auth";
import { prisma } from "~/lib/server/db";
import { sendOTP } from "~/lib/server/mail";

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    const user = await prisma.user.upsert({
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
