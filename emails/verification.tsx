import { Html } from "@react-email/html";
import { Text } from "@react-email/text";

interface VerificationEmailProps {
  otp: string;
  type?: "verification" | "login";
  appName?: string;
}

export function VerificationEmail({
  otp,
  type = "verification",
  appName = "ChadNext",
}: VerificationEmailProps) {
  const titleText = type === "login" ? "Your login code" : "Verify your email address";
  const messageText =
    type === "login"
      ? `Enter the following code to sign in to ${appName}:`
      : `Enter the following verification code to complete your sign-in to ${appName}:`;

  return (
    <Html>
      <div style={container}>
        <div style={content}>
          <Text style={title}>{titleText}</Text>
          <Text style={text}>{messageText}</Text>
          <div style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </div>
          <Text style={footerText}>
            This code will expire in 10 minutes. If you didn't request this code,
            please ignore this email.
          </Text>
        </div>
      </div>
    </Html>
  );
}

const container = {
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
  backgroundColor: "#ffffff",
};

const content = {
  padding: "40px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
};

const title = {
  fontSize: "24px",
  fontWeight: "600",
  marginBottom: "24px",
  color: "#111827",
};

const text = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "32px",
  color: "#374151",
};

const codeContainer = {
  backgroundColor: "#f9fafb",
  border: "2px dashed #e5e7eb",
  borderRadius: "8px",
  padding: "32px",
  marginBottom: "32px",
  textAlign: "center" as const,
};

const code = {
  fontSize: "36px",
  fontWeight: "700",
  letterSpacing: "8px",
  color: "#111827",
  margin: "0",
};

const footerText = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#6b7280",
};
