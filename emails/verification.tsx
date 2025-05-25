import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text
} from "@react-email/components";
interface VerificationTemplateProps {
  userName?: string;
  code: string;
}

export const VerificationTemp: React.FC<Readonly<VerificationTemplateProps>> = ({
  userName,
  code = "46590",
}) => (
  <Html>
    <Head />
    <Preview>Verify your email</Preview>
    <Tailwind>
      <Body className="bg-gray-100">
        <Container className="p-6 m-10 mx-auto bg-white">
          <Text className="mb-4 text-lg">Hi, {userName ? userName.split(" ")[0] : "there"}</Text>
          <Text className="text-base font-semibold text-center">
            Here is your verification code.
          </Text>
          <Section className="mt-4 text-center">
            <div className="inline-block px-6 py-3 text-xl font-bold tracking-[10px] text-slate-900">
              {code}
            </div>
            <Text className="mt-2.5 text-sm">
              This code expires in 3 minutes and can only be used once.
            </Text>
          </Section>
          <Text className="mt-8 text-base">
            Best,
            <br />
            <span className="font-bold">ChadNext</span>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
