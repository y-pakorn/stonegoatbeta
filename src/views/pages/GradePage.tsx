import { PlayerModal } from "@/components/Modal/PlayerModal";
import { BetaSection } from "@/components/Section/BetaSection";
import { Footer, Navbar, Section } from "@/components/common";
import { AppHeader } from "@/components/common/AppHeader";
import {
  GRADES_LABEL,
  INSTAGRAM_HANDLE_REGEX,
  MONTHS_LABEL,
  MONTHS_REGEX,
  formatGradeLabel,
} from "@/constants/grades";
import { ZONES, ZONES_REGEX, getZoneByLabel } from "@/constants/zones";
import { BetaInfo } from "@/interfaces/beta";
import { useBetas } from "@/stores/useBetas";
import { Center, CircularProgress, Heading, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export const GradePage = () => {
  const {
    query: { id },
  } = useRouter();

  const [gradeIndex, formattedLabel] = useMemo(() => {
    const label = String(id);
    const gradeIndex = GRADES_LABEL.indexOf(label as any);
    return [
      gradeIndex < 0 ? null : gradeIndex,
      formatGradeLabel(label),
    ] as const;
  }, [id]);

  const [allBetas, isLoading] = useBetas(
    (b) => [b.betas, b.isLoading] as const
  );
  const betas = useMemo(() => {
    const betas = new Map<string, BetaInfo[]>(
      ZONES.map((zone) => [zone.label, []])
    );
    if (gradeIndex === null) return [...betas];
    const grade = GRADES_LABEL[gradeIndex];
    const thisGradeBetas = allBetas.filter((b) => b.caption.includes(grade));
    const monthsFound = new Set<number>();
    for (const beta of thisGradeBetas) {
      const zones = [...beta.caption.matchAll(ZONES_REGEX)].map(
        (e) => e?.[1] || e?.[0]
      );
      const month = beta.caption.match(MONTHS_REGEX)?.[0];
      const instagramMatch = beta.caption.match(INSTAGRAM_HANDLE_REGEX);
      if (month && zones) {
        monthsFound.add(MONTHS_LABEL.indexOf(month as any));
        for (var i = 0; i < zones.length; i++) {
          const zone = zones[i];
          if (zone) {
            betas.get(zone)?.push({
              ...beta,
              zone: zone,
              month: month,
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
  }, [allBetas, gradeIndex]);

  const [isExpanded, setIsExpanded] = useState(
    Object.fromEntries(ZONES.map((key) => [key.label, true]))
  );

  const [selectedBeta, setSelectedBeta] = useState<BetaInfo | null>(null);

  return (
    <>
      <AppHeader title={gradeIndex === null ? undefined : formattedLabel} />
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
          {gradeIndex === null ? (
            <Heading>Grade not found!</Heading>
          ) : (
            <>
              <Heading>Grade {formattedLabel}</Heading>
              {isLoading ? (
                <Center h="50dvh">
                  <CircularProgress isIndeterminate color="primary.500" />
                </Center>
              ) : (
                <Stack spacing={4}>
                  {betas.map(([label, betas]) => {
                    if (betas.length > 0) {
                      return (
                        <BetaSection
                          key={label}
                          label={getZoneByLabel(label)?.name || label}
                          betas={betas}
                          isExpanded={isExpanded[label]}
                          toggleExpanded={() => {
                            setIsExpanded((prev) => ({
                              ...prev,
                              [label]: !prev[label],
                            }));
                          }}
                          selectBeta={(beta) => {
                            setSelectedBeta(beta);
                          }}
                        />
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
