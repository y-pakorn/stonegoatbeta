import { BoxProps, Container } from "@chakra-ui/react";

export const Section = (props: BoxProps) => {
  return (
    <Container
      maxW="container.xl"
      mx="auto"
      px={{ base: 10, md: 20 }}
      {...props}
    />
  );
};
