import {
  Text,
  Heading,
  Stack,
  chakra,
  Link,
  Divider,
  Card,
  Image,
  Button,
  SimpleGrid,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { Section, Navbar, Footer } from "@/components/common";
import { Logo } from "@/components/common/Logo";
import { DESCRIPTION } from "@/constants/texts";
import { ZONES } from "@/constants/zones";
import { default as NextLink } from "next/link";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { AppHeader } from "@/components/common/AppHeader";
import { GRADES_LABEL, formatGradeLabelSep } from "@/constants/grades";

export const HomePage = () => {
  return (
    <>
      <AppHeader title="All Betas" />
      <Section>
        <Navbar />
        <Stack py={[2, null, 8]}>
          <Logo />
          <Text>{DESCRIPTION}</Text>
          <Heading fontSize="xl">Special Thanks</Heading>
          <Stack>
            <Text>
              <chakra.span
                fontWeight="medium"
                as={Link}
                href="https://www.instagram.com/stonegoatclimb/"
                isExternal
              >
                Stonegoat <Icon as={FaArrowUpRightFromSquare} boxSize="12px" />
              </chakra.span>{" "}
              for amazing climbing gym.
            </Text>
            <Text>
              <chakra.span
                fontWeight="medium"
                as={Link}
                href="https://www.instagram.com/stonegoatbeta/"
                isExternal
              >
                Stonegoat Beta{" "}
                <Icon as={FaArrowUpRightFromSquare} boxSize="12px" />
              </chakra.span>{" "}
              for great beta compilation and aggregation.
            </Text>
            <Divider my={4} />
            <Heading fontSize="2xl">Walls / Zones</Heading>
            <SimpleGrid spacing={4} columns={[1, 2, 4]}>
              {ZONES.map((zone) => (
                <Card rounded="xl" p={4} gap={2} key={zone.label}>
                  <Image
                    src={zone.image}
                    height={["full", null, "xs"]}
                    width={["full", null, "3xs"]}
                    fit="cover"
                    rounded="lg"
                  />
                  <Text fontSize="xl" as="b">
                    {zone.name}
                  </Text>
                  <Button as={NextLink} href={`/zones/${zone.label}`}>
                    View Betas
                  </Button>
                </Card>
              ))}
            </SimpleGrid>
            <Divider my={4} />
            <Heading fontSize="2xl">Grades</Heading>
            <SimpleGrid spacing={4} columns={[1, 2, 4]}>
              {GRADES_LABEL.map((gl) => {
                const [grade, icon] = formatGradeLabelSep(gl);
                return (
                  <Card rounded="xl" p={4} gap={2} key={gl}>
                    <HStack justify="center">
                      <Text fontSize="xl" as="b">
                        {icon || grade}
                      </Text>
                    </HStack>
                    <Button as={NextLink} href={`/grades/${gl}`}>
                      View Betas
                    </Button>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Stack>
        </Stack>
        <Footer />
      </Section>
    </>
  );
};
