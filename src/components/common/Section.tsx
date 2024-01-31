import { BoxProps, Container } from "@chakra-ui/react";

export const Section = (props: BoxProps) => {
  return (
    <Container
      maxW="container.xl"
      mx="auto"
      px={{ base: 6, sm: 12, md: 20 }}
      {...props}
    />
  );
};
