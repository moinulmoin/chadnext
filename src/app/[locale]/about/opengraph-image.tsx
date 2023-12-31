/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import Logo from "../../../public/chad-next.png";

export const runtime = "edge";
export const alt = "ChadNext - Quick Starter Template for your Next.js project";
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, #E0E7FF 25%, #ffffff 50%, #CFFAFE 75%)",
        }}
        tw="h-full w-full flex flex-col items-center justify-center bg-white"
      >
        <h1
          style={{
            background:
              "linear-gradient(to bottom right, #000000 21.66%, #78716c 86.47%)",
            backgroundClip: "text",
          }}
          tw="text-8xl font-bold leading-loose text-transparent"
        >
          About
        </h1>
        <div tw="flex items-center">
          <img
            src={process.env.NEXT_PUBLIC_APP_URL + Logo.src}
            alt="ChadNext Logo"
            tw="w-10 h-10 opacity-95 mr-4"
            width={40}
            height={40}
          />
          <h2 tw="text-5xl font-bold leading-loose ">ChadNext</h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
