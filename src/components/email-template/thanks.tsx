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

interface ThanksTemplateProps {
  userName: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://chadnext.moinulmoin.com/";

export const ThanksTemp: React.FC<Readonly<ThanksTemplateProps>> = ({
  userName,
}) => (
  <Html>
    <Head />
    <Preview>Welcome to ChadNext.</Preview>
    <Tailwind>
      <Body className="bg-white">
        <Container className="mx-auto py-20">
          <Section className="mx-auto text-center">
            <Row>
              <Column align="right">
                <Img
                  src={`${baseUrl}/chad-next.png`}
                  height="50"
                  alt="ChadNext logo"
                  className=" inline-block"
                />
              </Column>
              <Column align="left">
                <Text className="ml-2 text-lg font-bold">ChadNext</Text>
              </Column>
            </Row>
          </Section>
          <Text className="my-4 text-base leading-6">Hi {userName},</Text>
          <Text className="text-base leading-6">
            Welcome to ChadNext. Now you can build your Next.js project 10x
            faster.
          </Text>
          <Section className="mt-8 text-center">
            <Button
              className="bg-bg-white inline-block rounded-md bg-slate-900 px-6 py-3 text-base text-gray-100"
              href="https://github.com/moinulmoin/chadnext"
            >
              Star on GitHub
            </Button>
          </Section>
          <Text className="mt-8 text-base leading-6">
            Best,
            <br />
            ChadNext team
          </Text>
          <Hr className="my-6 border-gray-300" />
          <Text className="text-x text-gray-600">
            Developed by{" "}
            <Link href="https://twitter.com/immoinulmoin">Moinul Moin</Link>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
