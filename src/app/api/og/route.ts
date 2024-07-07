import { ImageResponse } from "next/og";
import { RenderIMGEl } from "~/components/OGImgEl";
import { siteUrl } from "~/config/site";
import Logo from "public/chad-next.png";
import homepageImage from "public/chadnext-homepage.png";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hasLocale = searchParams.has("locale");
  const locale = hasLocale ? searchParams.get("locale") : "";

  try {
    return new ImageResponse(
      RenderIMGEl({
        logo: siteUrl + Logo.src,
        locale: locale as string,
        image: siteUrl + homepageImage.src,
      }),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
