import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ThanksTemplateProps {
  userName: string;
}

const ThanksTemp: React.FC<Readonly<ThanksTemplateProps>> = ({ userName }) => (
  <Html>
    <Head />
    <Preview>Welcome to ChadNext.</Preview>
    <Tailwind>
      <Body className=" bg-gray-100">
        <Container className="mx-auto my-10 bg-white">
          <Section className="my-8">
            <Text className="mx-10 text-lg font-bold">Hi {userName} 👋 ,</Text>
            <Text className="mx-10 text-base">
              Welcome to ChadNext. Now you can build your idea faster. You can
              star the project on GitHub. That would be very helpful.
            </Text>
            <Section className="my-5 text-center">
              <Button
                className="bg-bg-white inline-block rounded-md bg-slate-900 px-6 py-3 text-base text-white"
                href="https://github.com/moinulmoin/chadnext"
                target="_blank"
                rel="noopener noreferrer"
              >
                Star on GitHub
              </Button>
            </Section>
            <Text className="mx-10  text-base font-light">Best,</Text>
            <Text className="mx-10 text-base font-bold">ChadNext</Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ThanksTemp;
