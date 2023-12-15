// * INFO: Right now, this template is not being used in the project

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const siteUrl =
  process.env.NEXT_PUBLIC_URL ?? "https://chadnext.moinulmoin.com";

interface VerificationTemplateProps {
  userName: string;
  verificationUrl: string;
}

const VerificationTemp: React.FC<Readonly<VerificationTemplateProps>> = ({
  userName,
  verificationUrl,
}) => (
  <Html>
    <Head />
    <Preview>Click the link below to sign in to your account.</Preview>
    <Tailwind>
      <Body className="bg-white">
        <Container className="mx-auto py-20">
          <Section className="mx-auto text-center">
            <Row>
              <Column align="right">
                <Img
                  src={`${siteUrl}/chad-next.png`}
                  height="50"
                  alt="ChadNext logo"
                  className="inline-block "
                />
              </Column>
              <Column align="left">
                <Text className="ml-2 text-lg font-bold">ChadNext</Text>
              </Column>
            </Row>
          </Section>
          <Text className="my-4 text-lg">Hi, {userName.split(" ")[0]}</Text>
          <Text className="text-center text-base font-semibold ">
            Click the link below to sign in to your account.
          </Text>
          <Section className="mt-8 text-center">
            <Button
              className="bg-bg-white inline-block rounded-md bg-slate-900 px-6 py-3 text-base text-gray-100"
              href={verificationUrl}
            >
              Sign In
            </Button>
            <Text className="mt-2.5 text-sm ">
              This link expires in 24 hours and can only be used once.
            </Text>
          </Section>
          <Text className="mt-8 ">
            Best,
            <br />
            ChadNext team
          </Text>
          <Hr className="my-8 border-gray-300" />
          <Text className="text-sm text-gray-600">
            Developed by{" "}
            <Link href="https://twitter.com/immoinulmoin">Moinul Moin</Link>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default VerificationTemp;
