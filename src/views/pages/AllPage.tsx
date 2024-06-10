import { FilterBar } from "@/components/All/FilterBar";
import { MiniGrade } from "@/components/All/MiniGrade";
import { BetaCard } from "@/components/Card/BetaCard";
import { Footer, Navbar, Section } from "@/components/common";
import { AppHeader } from "@/components/common/AppHeader";
import { getZoneByLabel } from "@/constants/zones";
import { useBetas } from "@/stores/useBetas";
import {
  Center,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

export const timeOptions = {
  "1Day": 1,
  "1Week": 7,
  "1Month": 30,
  "2Months": 60,
  all: 9999,
} as const;
const defaultTime = "2Months";
const defaultTimeSort = "desc";

export const AllPage = () => {
  const { query, replace, isReady } = useRouter();

  const filter = useMemo(() => {
    return {
      zones: query.zones ? query.zones.toString().split(",") || [] : [],
      grades: query.grades ? query.grades.toString().split(",") || [] : [],
      time: (query.time || defaultTime) as keyof typeof timeOptions,
      timeSort: (query.timeSort || defaultTimeSort) as string,
      search: (query.search || "") as string,
    } as const;
  }, [query]);

  useEffect(() => {
    if (isReady && (!query.time || !query.timeSort)) {
      replace({
        query: {
          ...query,
          time: defaultTime,
          timeSort: defaultTimeSort,
        },
      });
    }
  }, [query, replace, isReady]);

  const [allBetas, isLoading] = useBetas(
    (b) => [b.betas, b.isLoading] as const
  );

  const betas = useMemo(() => {
    if (!isReady) return [];

    const isDesc = filter.timeSort === "desc";
    const timeFilter = new Date();
    timeFilter.setDate(timeFilter.getDate() - timeOptions[filter.time]);

    return allBetas
      .filter((b) => {
        const grade =
          b.zone === "comp-wall" || !b.grade
            ? "comp"
            : b.grade?.replace(/[0-9]/g, "");
        return (
          (!filter.zones.length || filter.zones.includes(b.zone)) &&
          (!filter.grades.length || filter.grades.includes(grade)) &&
          b.timestamp > timeFilter &&
          (!filter.search ||
            (b.instagram && b.instagram.includes(filter.search)))
        );
      })
      .sort((a, b) => {
        if (a.timestamp > b.timestamp) return isDesc ? -1 : 1;
        if (a.timestamp < b.timestamp) return isDesc ? 1 : -1;
        return 0;
      });
  }, [allBetas, filter, isReady]);

  return (
    <>
      <AppHeader title="All" />
      <Section>
        <Navbar />
        <Stack py={[2, null, 8]}>
          <FilterBar {...filter} />
          {isLoading ? (
            <Center h="50dvh">
              <Spinner size="xl" color="primary.500" />
            </Center>
          ) : (
            <SimpleGrid spacing={4} columns={[2, 3, 5]}>
              {betas.map((b, i) => {
                return (
                  <BetaCard {...b} key={`${b.id}-${i}`}>
                    <HStack justify="space-between" fontWeight="bold" w="100%">
                      <Text>
                        <MiniGrade grade={b.grade} />
                      </Text>
                      <Text>{getZoneByLabel(b.zone)?.name}</Text>
                    </HStack>
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
