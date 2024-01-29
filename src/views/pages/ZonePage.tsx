import { PlayerModal } from "@/components/Modal/PlayerModal";
import { BetaSection } from "@/components/Section/BetaSection";
import { Footer, Navbar, Section } from "@/components/common";
import { AppHeader } from "@/components/common/AppHeader";
import {
  COMP_GRADES,
  COMP_GRADES_REGEX,
  GRADES_LABEL,
  GRADES_REGEX,
  INSTAGRAM_HANDLE_REGEX,
  MONTHS_REGEX,
  formatCompGrade,
  formatGradeLabel,
} from "@/constants/grades";
import { getZoneByLabel } from "@/constants/zones";
import { BetaInfo } from "@/interfaces/beta";
import { useBetas } from "@/stores/useBetas";
import {
  Center,
  CircularProgress,
  Heading,
  Stack,
  chakra,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

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
    for (const beta of thisZoneBetas) {
      const grades = [
        ...beta.caption.matchAll(isComp ? COMP_GRADES_REGEX : GRADES_REGEX),
      ].map((e) => e?.[1] ?? e?.[0]);
      const monthMatch = beta.caption.match(MONTHS_REGEX);
      const instagramMatch = beta.caption.match(INSTAGRAM_HANDLE_REGEX);
      if (monthMatch && grades) {
        for (var i = 0; i < grades.length; i++) {
          const grade = grades[i];
          if (grade) {
            betas.get(grade)?.push({
              ...beta,
              zone: zone?.label ?? "",
              month: monthMatch[0],
              grade: grade as any,
              instagram: instagramMatch?.[0] || null,
              date: new Date(beta.timestamp),
            });
          }
        }
      }
    }

    const oneAndHalfMonthAgo = new Date();
    oneAndHalfMonthAgo.setMonth(oneAndHalfMonthAgo.getMonth() - 1.5);

    return [...betas.entries()].map(
      ([label, betas]) =>
        [
          label,
          betas.filter((b) => b.date && b.date > oneAndHalfMonthAgo),
        ] as const
    );
  }, [allBetas, isComp]);

  const [isExpanded, setIsExpanded] = useState(
    Object.fromEntries(GRADES_LABEL.map((key) => [key, true]))
  );

  const [selectedBeta, setSelectedBeta] = useState<BetaInfo | null>(null);

  return (
    <>
      <AppHeader title={zone?.name} />
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
                    const comp = formatCompGrade(label);
                    const gradeLabel = formatGradeLabel(label);
                    if (betas.length > 0) {
                      return (
                        <BetaSection
                          key={label}
                          label={
                            comp ? (
                              <chakra.span
                                bg={COMP_GRADES[comp].color}
                                color="white"
                                px={2}
                              >
                                {gradeLabel}
                              </chakra.span>
                            ) : (
                              gradeLabel
                            )
                          }
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
