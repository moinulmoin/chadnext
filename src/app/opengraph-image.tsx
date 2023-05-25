/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server";

export const runtime = "edge";
export const alt = "ChadNext - Quick Starter Template for your Next.js project";
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage:
            "linear-gradient(to bottom right, #E0E7FF 25%, #ffffff 50%, #CFFAFE 75%)",
        }}
      >
        <img
          src={new URL(
            "../../public/chad-next.png",
            import.meta.url
          ).toString()}
          alt="ChadNext Logo"
          tw="w-20 h-20 mb-4 opacity-95"
          width={80}
          height={80}
        />
        <h1
          style={{
            fontSize: "100px",
            fontWeight: 900,
            background:
              "linear-gradient(to bottom right, #000000 21.66%, #78716c 86.47%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: "5rem",
            letterSpacing: "-0.02em",
          }}
        >
          ChadNext
        </h1>
        <h2
          style={{
            fontSize: "40px",
            fontWeight: 700,
            lineHeight: "5rem",
            letterSpacing: "-0.02em",
          }}
        >
          Quick Starter Template for your Next project
        </h2>
        <p>Developed by Moinul Moin</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
