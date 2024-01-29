import { BetaCard } from "@/components/Card/BetaCard";
import { PlayerModal } from "@/components/Modal/PlayerModal";
import { Footer, Navbar, Section } from "@/components/common";
import { AppHeader } from "@/components/common/AppHeader";
import {
  GRADES_REGEX,
  INSTAGRAM_HANDLE_REGEX,
  MONTHS_REGEX,
  formatGradeLabelSep,
} from "@/constants/grades";
import { ZONES_REGEX, getZoneByLabel } from "@/constants/zones";
import { BetaInfo } from "@/interfaces/beta";
import { useBetas } from "@/stores/useBetas";
import {
  Center,
  CircularProgress,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

export const AllPage = () => {
  const [allBetas, isLoading] = useBetas(
    (b) => [b.betas, b.isLoading] as const
  );

  const betas = useMemo(() => {
    const betas: BetaInfo[] = [];
    for (const beta of allBetas) {
      const zones = [...beta.caption.matchAll(ZONES_REGEX)].map(
        (e) => e?.[1] || e?.[0]
      );
      const grades = [...beta.caption.matchAll(GRADES_REGEX)].map(
        (e) => e?.[1] ?? e?.[0]
      );
      const month = beta.caption.match(MONTHS_REGEX)?.[0];
      const instagramMatch = beta.caption.match(INSTAGRAM_HANDLE_REGEX);
      if (month && grades && zones) {
        for (var i = 0; i < grades.length; i++) {
          const grade = grades[i];
          for (var j = 0; j < zones.length; j++) {
            const zone = zones[j];
            if (grade && zone) {
              betas.push({
                ...beta,
                zone,
                month,
                grade: grade as any,
                instagram: instagramMatch?.[0] || null,
                date: new Date(beta.timestamp),
              });
            }
          }
        }
      }
    }
    return betas;
  }, [allBetas]);

  const [selectedBeta, setSelectedBeta] = useState<BetaInfo | null>(null);

  return (
    <>
      <AppHeader title="All" />
      <Section>
        <Navbar />
        <PlayerModal
          isOpen={!!selectedBeta}
          onClose={() => {
            setSelectedBeta(null);
          }}
          beta={selectedBeta}
        />
        <Stack py={[2, null, 8]}>
          {isLoading ? (
            <Center h="50dvh">
              <CircularProgress isIndeterminate color="primary.500" />
            </Center>
          ) : (
            <SimpleGrid spacing={4} columns={[1, 3, 5]}>
              {betas.map((b, i) => {
                const [label, icon] = formatGradeLabelSep(b.grade);
                return (
                  <BetaCard
                    {...b}
                    select={() => setSelectedBeta(b)}
                    key={`${b.id}-${i}`}
                  >
                    <Stack w="100%">
                      <HStack justify="space-between">
                        <Text>Grade</Text>
                        <Text as="b" textAlign="right">
                          {icon || label}
                        </Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Wall</Text>
                        <Text as="b" textAlign="right">
                          {getZoneByLabel(b.zone)?.name}
                        </Text>
                      </HStack>
                    </Stack>
                  </BetaCard>
                );
              })}
            </SimpleGrid>
          )}
        </Stack>
        <Footer />
      </Section>
    </>
  );
};
