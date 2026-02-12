import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Button } from "@react-email/button";

interface OtpEmailProps {
  otp: string;
  appName?: string;
}

export function OtpEmail({ otp, appName = "ChadNext" }: OtpEmailProps) {
  return (
    <Html>
      <div style={container}>
        <div style={content}>
          <Text style={title}>Verify your email address</Text>
          <Text style={text}>
            Enter the following verification code to complete your sign-in to{" "}
            {appName}:
          </Text>
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
