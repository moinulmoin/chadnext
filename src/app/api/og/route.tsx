import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const title = "ChadNext v2 - AI SaaS Template";
  const description =
    "ChadNext v2 is an AI-focused indie SaaS starter template built with Next.js 16, " +
    "Tailwind 4, shadcn/ui, and Convex. Ship your AI SaaS faster than fast.";

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
          backgroundColor: "#000",
          backgroundImage:
            "linear-gradient(to bottom right, #1e1b4b, #0f172a)",
          color: "#fff",
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
            }}
          />
          <span style={{ fontSize: 64, fontWeight: 800 }}>ChadNext v2</span>
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            opacity: 0.9,
            textAlign: "center",
            maxWidth: 1000,
            padding: "0 40px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            opacity: 0.7,
            textAlign: "center",
            maxWidth: 900,
            marginTop: 20,
            padding: "0 60px",
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
