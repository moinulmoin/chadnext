import { Html } from "@react-email/html";
import { Text } from "@react-email/text";

interface WelcomeEmailProps {
  name?: string;
  appName?: string;
}

export function WelcomeEmail({
  name,
  appName = "ChadNext",
}: WelcomeEmailProps) {
  const greeting = name ? `Welcome, ${name}!` : "Welcome!";

  return (
    <Html>
      <div style={container}>
        <div style={content}>
          <Text style={title}>{greeting}</Text>
          <Text style={text}>
            We&apos;re excited to have you on board. You&apos;ve just joined{" "}
            {appName}, and we can&apos;t wait to see what you&apos;ll build.
          </Text>

          <Text style={heading}>What&apos;s next?</Text>

          <div style={featureList}>
            <Text style={featureText}>
              <strong>✨ Quick Start:</strong> Jump right in and explore our
              intuitive interface designed for speed and efficiency.
            </Text>
            <Text style={featureText}>
              <strong>🚀 Build Fast:</strong> Create projects, manage workflows,
              and ship features with our streamlined tools.
            </Text>
            <Text style={featureText}>
              <strong>🔒 Stay Secure:</strong> Your data is protected with
              enterprise-grade security and privacy controls.
            </Text>
          </div>

          <Text style={text}>
            If you have any questions or need help getting started, feel free to
            reach out to our support team.
          </Text>

          <Text style={footerText}>
            Thanks for being part of {appName}!
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
  fontSize: "28px",
  fontWeight: "600",
  marginBottom: "24px",
  color: "#111827",
};

const text = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "24px",
  color: "#374151",
};

const heading = {
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "16px",
  color: "#111827",
};

const featureList = {
  marginBottom: "32px",
};

const featureText = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "16px",
  color: "#374151",
};

const footerText = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#6b7280",
};
