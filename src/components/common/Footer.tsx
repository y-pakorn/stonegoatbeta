import { TITLE } from "@/constants/texts";
import { ZONES } from "@/constants/zones";
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  Heading,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { default as NextLink } from "next/link";

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight="700" fontSize="lg" color="primary.400" mb={2}>
      {children}
    </Text>
  );
};

const Footer = () => {
  return <></>;
  return (
    <>
      <Box mt={20} borderRadius="xl">
        <Container as={Stack} maxW="6xl" py={10}>
          <SimpleGrid
            templateColumns={{ sm: "1fr 1fr", md: "4fr 1fr 1fr" }}
            spacing={2}
          >
            <Stack spacing={3}>
              <Heading fontSize="xl">{TITLE}</Heading>
              <Text>Made with love by yoisha</Text>
            </Stack>
            <Stack align={["start", null, "end"]}>
              <ListHeader>Walls</ListHeader>
              {ZONES.map((zone) => (
                <Link as={NextLink} href={`/zones/${zone.label}`}>
                  {zone.name}
                </Link>
              ))}
            </Stack>
            <Stack align={["start", null, "end"]}>
              <ListHeader>About</ListHeader>
              <Link as={NextLink} href="#">
                About
              </Link>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
