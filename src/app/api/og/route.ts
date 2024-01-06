import { ImageResponse } from "next/og";
import { RenderIMGEl } from "~/components/OGImgEl";
import Logo from "../../../../public/chad-next.png";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hasTitle = searchParams.has("title");
  const title = hasTitle
    ? searchParams.get("title")
    : "Quick Starter Template for your Next project";

  try {
    return new ImageResponse(
      RenderIMGEl({
        logo: process.env.NEXT_PUBLIC_APP_URL + Logo.src,
        title: title as string,
      }),
      {
        width: 1200,
        height: 630,
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
