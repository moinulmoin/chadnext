import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
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
  code: string;
}

const VerificationTemp: React.FC<Readonly<VerificationTemplateProps>> = ({
  userName = "X",
  code = "46590",
}) => (
  <Html>
    <Head />
    <Preview>Verify your email</Preview>
    <Tailwind>
      <Body className="bg-gray-100">
        <Container className="m-10 mx-auto bg-white p-10">
          <Section className="mx-auto text-center">
            <Row>
              <Column align="right">
                <Img
                  src={`${siteUrl}/chad-next.png`}
                  height="50"
                  alt="ChadNext logo"
                  className="inline-block"
                />
              </Column>
              <Column align="left">
                <Text className="ml-2 text-lg font-bold">ChadNext</Text>
              </Column>
            </Row>
          </Section>
          <Text className="my-4 text-lg">Hi, {userName.split(" ")[0]}</Text>
          <Text className="text-center text-base font-semibold">
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

export default VerificationTemp;
