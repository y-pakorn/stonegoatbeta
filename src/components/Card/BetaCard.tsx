import { BetaInfo } from "@/interfaces/beta";
import {
  HStack,
  Icon,
  Image,
  Link,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { ReactNode } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";

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
      <Stack spacing={0} align="end" fontStyle="italic" fontSize="sm">
        {b.instagram && (
          <Text
            as={Link}
            isExternal
            href={`https://www.instagram.com/${b.instagram.slice(1)}`}
          >
            {b.instagram}
          </Text>
        )}
        <HStack>
          <Icon as={FaClockRotateLeft} fontSize="xs" />
          <Text>{formatDistanceToNow(b.date)} Ago</Text>
        </HStack>
      </Stack>
      <Spacer />
      {children}
    </Stack>
  );
};
