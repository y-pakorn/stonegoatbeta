import { BetaInfo } from "@/interfaces/beta";
import { Image, Link, Spacer, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export const BetaCard = ({
  select,
  children,
  ...b
}: BetaInfo & {
  select: () => void;
  children?: ReactNode;
}) => {
  return (
    <Stack align="end">
      <Image
        rounded="lg"
        src={b.thumbnail_url}
        w="full"
        fit="scale-down"
        cursor="pointer"
        onClick={select}
      />
      {b.instagram ? (
        <Text
          fontStyle="italic"
          fontSize="sm"
          as={Link}
          isExternal
          href={`https://www.instagram.com/${b.instagram.slice(1)}`}
        >
          {b.instagram}
        </Text>
      ) : (
        <Spacer />
      )}
      {children}
    </Stack>
  );
};
