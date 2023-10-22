import { Footer, Navbar, Section } from "@/components/common";
import { AppHeader } from "@/components/common/AppHeader";
import {
  COMP_GRADES_REGEX,
  GRADES_LABEL,
  GRADES_REGEX,
  INSTAGRAM_HANDLE_REGEX,
  MONTHS_LABEL,
  MONTHS_REGEX,
  formatGradeLabel,
} from "@/constants/grades";
import { getZoneByLabel } from "@/constants/zones";
import { BetaInfo } from "@/interfaces/beta";
import { useBetas } from "@/stores/useBetas";
import {
  AspectRatio,
  Center,
  CircularProgress,
  Collapse,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Link,
  Modal,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import {
  FaArrowUpRightFromSquare,
  FaChevronDown,
  FaXmark,
} from "react-icons/fa6";
import ReactPlayer from "react-player";

export const ZonePage = () => {
  const {
    query: { id },
  } = useRouter();

  const [zone, isComp] = useMemo(() => {
    const zone = getZoneByLabel(String(id));
    return [zone, zone?.label === "comp-wall"] as const;
  }, [id]);

  const [allBetas, isLoading] = useBetas(
    (b) => [b.betas, b.isLoading] as const
  );
  const betas = useMemo(() => {
    const thisZoneBetas = allBetas.filter((b) =>
      b.caption.includes(zone?.label ?? "")
    );
    const betas = new Map<string, BetaInfo[]>(
      GRADES_LABEL.map((label) => [label as string, []])
    );
    const monthsFound = new Set<number>();
    for (const beta of thisZoneBetas) {
      const grades = isComp
        ? [...beta.caption.matchAll(COMP_GRADES_REGEX)].map((e) => e?.[1])
        : [beta.caption.match(GRADES_REGEX)?.[0]];
      const monthMatch = beta.caption.match(MONTHS_REGEX);
      const instagramMatch = beta.caption.match(INSTAGRAM_HANDLE_REGEX);
      if (monthMatch && grades) {
        monthsFound.add(MONTHS_LABEL.indexOf(monthMatch[0] as any));
        for (const grade of grades) {
          if (grade) {
            betas.get(grade)?.push({
              ...beta,
              month: monthMatch[0],
              grade: grade as any,
              instagram: instagramMatch?.[0] || null,
            });
          }
        }
      }
    }

    const twoLatestMonths = [...monthsFound]
      .sort((a, b) => b - a)
      .slice(0, 2)
      .map((m) => MONTHS_LABEL[m]);
    const latestBetas = [...betas.entries()].map(
      ([label, betas]) =>
        [
          label,
          betas.filter((b) => twoLatestMonths.includes(b.month as any)),
        ] as const
    );

    return latestBetas;
  }, [allBetas, isComp]);

  const [isExpanded, setIsExpanded] = useState(
    Object.fromEntries(GRADES_LABEL.map((key) => [key, true]))
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBeta, setSelectedBeta] = useState<BetaInfo | null>(null);

  return (
    <>
      <AppHeader title={zone?.name} />
      <Section>
        <Navbar />
        <Modal
          isCentered
          size="xl"
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedBeta(null);
          }}
        >
          <ModalOverlay />
          <ModalContent bg="transparent" m={4}>
            <HStack pos="absolute" top={4} right={4} zIndex={1}>
              <IconButton
                icon={<Icon as={FaArrowUpRightFromSquare} />}
                aria-label="Open Instagram"
                rounded="xl"
                colorScheme="whiteAlpha"
                as={Link}
                href={selectedBeta?.permalink}
                isExternal
              />
              <IconButton
                icon={<Icon as={FaXmark} />}
                aria-label="Close"
                rounded="xl"
                colorScheme="whiteAlpha"
                onClick={onClose}
              />
            </HStack>
            <AspectRatio ratio={9 / 16}>
              <ReactPlayer
                style={{
                  borderRadius: "24px",
                }}
                controls
                muted
                playing
                loop
                url={selectedBeta?.media_url}
                width="100%"
                height="100%"
              />
            </AspectRatio>
          </ModalContent>
        </Modal>
        <Stack py={[2, null, 8]}>
          {!zone ? (
            <Heading>Wall not found!</Heading>
          ) : (
            <>
              <Heading>{zone.name} Wall</Heading>
              {isLoading ? (
                <Center h="50dvh">
                  <CircularProgress isIndeterminate color="primary.500" />
                </Center>
              ) : (
                <Stack spacing={4}>
                  {betas.map(([label, betas]) => {
                    if (betas.length > 0) {
                      return (
                        <Stack key={label}>
                          <HStack justify="space-between">
                            <Heading fontSize="xl">
                              {formatGradeLabel(label)}
                            </Heading>
                            <IconButton
                              aria-label="Collapse/Expand"
                              rounded="lg"
                              size="sm"
                              icon={
                                <Icon
                                  as={FaChevronDown}
                                  transform={
                                    isExpanded[label] ? "rotate(180deg)" : ""
                                  }
                                  transition="transform 0.2s ease-in-out"
                                />
                              }
                              onClick={() =>
                                setIsExpanded((prev) => ({
                                  ...prev,
                                  [label]: !prev[label],
                                }))
                              }
                            />
                          </HStack>
                          <Collapse in={isExpanded[label]} animateOpacity>
                            <SimpleGrid spacing={4} columns={[1, 3, 5]}>
                              {betas.map((b) => (
                                <Stack key={b.id} align="end">
                                  <Image
                                    rounded="lg"
                                    src={b.thumbnail_url}
                                    w="full"
                                    fit="scale-down"
                                    cursor="pointer"
                                    onClick={() => {
                                      setSelectedBeta(b);
                                      onOpen();
                                    }}
                                  />
                                  {b.instagram && (
                                    <Text
                                      fontStyle="italic"
                                      fontSize="sm"
                                      as={Link}
                                      isExternal
                                      href={`https://www.instagram.com/${b.instagram.slice(
                                        1
                                      )}`}
                                    >
                                      {b.instagram}
                                    </Text>
                                  )}
                                </Stack>
                              ))}
                            </SimpleGrid>
                          </Collapse>
                        </Stack>
                      );
                    }
                  })}
                </Stack>
              )}
            </>
          )}
        </Stack>
        <Footer />
      </Section>
    </>
  );
};
