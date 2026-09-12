import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const title = "The agent-native SaaS starter";
  const description =
    "Built by your agents. Ships with Sigma. Next.js 16, Convex, " +
    "better-auth, Polar, and AI SDK v7 — pre-wired into a working product.";

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
