import { Html } from "@react-email/html";
import { Text } from "@react-email/text";

interface SubscriptionEmailProps {
  planName?: string;
  name?: string;
  appName?: string;
}

export function SubscriptionEmail({
  planName = "Pro",
  name,
  appName = "ChadNext",
}: SubscriptionEmailProps) {
  const greeting = name ? `Hi ${name},` : "Hi,";

  return (
    <Html>
      <div style={container}>
        <div style={content}>
          <Text style={title}>You&apos;ve been upgraded to {planName}!</Text>
          <Text style={text}>
            {greeting} Great news! Your {appName} account has been successfully
            upgraded to the {planName} plan.
          </Text>

          <Text style={heading}>Your new {planName} benefits:</Text>

          <div style={featureList}>
            <Text style={featureText}>
              <strong>🚀 Unlimited Access:</strong> No more limits on your
              projects and usage.
            </Text>
            <Text style={featureText}>
              <strong>⚡ Priority Support:</strong> Get faster responses from our
              dedicated support team.
            </Text>
            <Text style={featureText}>
              <strong>🎨 Advanced Features:</strong> Unlock exclusive tools and
              customization options.
            </Text>
            <Text style={featureText}>
              <strong>📊 Enhanced Analytics:</strong> Deeper insights and reporting
              capabilities for your data.
            </Text>
          </div>

          <Text style={text}>
            Start exploring your new {planName} features right away. We&apos;re
            here to help you make the most of your upgrade.
          </Text>

          <Text style={footerText}>
            Thank you for choosing {appName}!
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
