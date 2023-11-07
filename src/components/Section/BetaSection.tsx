import {
  Collapse,
  HStack,
  Heading,
  Icon,
  IconButton,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa6";
import { BetaCard } from "../Card/BetaCard";
import { BetaInfo } from "@/interfaces/beta";
import { ReactNode } from "react";

export const BetaSection = ({
  label,
  isExpanded,
  toggleExpanded,
  selectBeta,
  betas,
}: {
  label: ReactNode;
  isExpanded: boolean;
  toggleExpanded: () => void;
  selectBeta: (beta: BetaInfo) => void;
  betas: BetaInfo[];
}) => {
  return (
    <Stack>
      <HStack justify="space-between">
        <Heading fontSize="xl">{label}</Heading>
        <IconButton
          aria-label="Collapse/Expand"
          rounded="lg"
          size="sm"
          icon={
            <Icon
              as={FaChevronDown}
              transform={isExpanded ? "rotate(180deg)" : ""}
              transition="transform 0.2s ease-in-out"
            />
          }
          onClick={toggleExpanded}
        />
      </HStack>
      <Collapse in={isExpanded} animateOpacity>
        <SimpleGrid spacing={4} columns={[1, 3, 5]}>
          {betas.map((b) => (
            <BetaCard
              key={b.id}
              select={() => {
                selectBeta(b);
              }}
              {...b}
            />
          ))}
        </SimpleGrid>
      </Collapse>
    </Stack>
  );
};
