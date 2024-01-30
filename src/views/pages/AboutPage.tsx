import { Footer, Navbar, Section } from "@/components/common";
import { AppHeader } from "@/components/common/AppHeader";
import { TECH_STACK } from "@/constants/stack";
import {
  Divider,
  Heading,
  Icon,
  Link,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
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
          <Text>
            Made with love by{" "}
            <Link href="https://www.instagram.com/climbwithyoisha/" isExternal>
              yoisha
            </Link>{" "}
            🥰
          </Text>
          <Divider my={4} />
          <Heading fontSize="2xl">Tech Stack</Heading>
          <UnorderedList pl={2}>
            {TECH_STACK.map((t, i) => (
              <ListItem key={i}>
                <Text as="b">{t[0]}</Text>
                <UnorderedList>
                  {t[1].map((ts, j) => (
                    <ListItem key={j}>{ts}</ListItem>
                  ))}
                </UnorderedList>
              </ListItem>
            ))}
          </UnorderedList>
        </Stack>
        <Footer />
      </Section>
    </>
  );
};
