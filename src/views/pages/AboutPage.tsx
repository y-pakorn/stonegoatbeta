import { Footer, Navbar, Section } from "@/components/common";
import { AppHeader } from "@/components/common/AppHeader";
import { Heading, Stack, Text } from "@chakra-ui/react";

export const AboutPage = () => {
  return (
    <>
      <AppHeader title="About" />
      <Section>
        <Navbar />
        <Stack py={[2, null, 8]}>
          <Heading>About</Heading>
          <Text>Made with love by yoisha</Text>
          <Text>Heh heh heh</Text>
        </Stack>
        <Footer />
      </Section>
    </>
  );
};
