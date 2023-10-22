import { Footer, Navbar, Section } from "@/components/common";
import { AppHeader } from "@/components/common/AppHeader";
import { Heading, Icon, Link, Stack, Text } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa6";

export const AboutPage = () => {
  return (
    <>
      <AppHeader title="About" />
      <Section>
        <Navbar />
        <Stack py={[2, null, 8]}>
          <Heading>About</Heading>
          <Text as="i" fontSize="lg">
            This website is opensourced in{" "}
            <Link href="https://github.com/y-pakorn/stonegoatbeta" isExternal>
              Github <Icon as={FaGithub} />
            </Link>
            . Contribution and ideas suggestion are welcomed!
          </Text>
          <Text>Made with love by yoisha 🥰</Text>
        </Stack>
        <Footer />
      </Section>
    </>
  );
};
