import { BetaCard } from "@/components/Card/BetaCard";
import { PlayerModal } from "@/components/Modal/PlayerModal";
import { Footer, Navbar, Section } from "@/components/common";
import { AppHeader } from "@/components/common/AppHeader";
import {
  GRADES_REGEX,
  INSTAGRAM_HANDLE_REGEX,
  MONTHS_LABEL,
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
    const monthsFound = new Set<number>();
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
        monthsFound.add(MONTHS_LABEL.indexOf(month as any));
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
              });
            }
          }
        }
      }
    }

    const twoLatestMonths = [...monthsFound]
      .sort((a, b) => b - a)
      .slice(0, 2)
      .map((m) => MONTHS_LABEL[m]);
    const latestBetas = betas.filter((b) =>
      twoLatestMonths.includes(b.month as any)
    );

    return latestBetas;
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
              {betas.map((b) => {
                const [label, icon] = formatGradeLabelSep(b.grade);
                return (
                  <BetaCard {...b} select={() => setSelectedBeta(b)} key={b.id}>
                    <Stack w="100%">
                      <HStack justify="space-between">
                        <Text>Grade</Text>
                        <Text as="b">{icon || label}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Wall</Text>
                        <Text as="b">{getZoneByLabel(b.zone)?.name}</Text>
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
