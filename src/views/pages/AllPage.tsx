import { MiniGrade } from "@/components/All/MiniGrade";
import { BetaCard } from "@/components/Card/BetaCard";
import { PlayerModal } from "@/components/Modal/PlayerModal";
import { Footer, Navbar, Section } from "@/components/common";
import { AppHeader } from "@/components/common/AppHeader";
import {
  COMP_GRADES,
  GRADES_LABEL,
  formatCompGradeWithSex,
  formatGradeLabelSep,
} from "@/constants/grades";
import { ZONES, getZoneByLabel } from "@/constants/zones";
import { BetaInfo } from "@/interfaces/beta";
import { useBetas } from "@/stores/useBetas";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  CircularProgress,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  FaArrowDownWideShort,
  FaArrowUpWideShort,
  FaClockRotateLeft,
  FaGraduationCap,
  FaLocationDot,
} from "react-icons/fa6";

const timeOptions = {
  oneDay: 1,
  oneWeek: 7,
  twoWeeks: 14,
  oneMonth: 30,
  twoMonths: 60,
  all: 9999,
} as const;
const defaultTime = "twoMonths";
const defaultTimeSort = "desc";

export const AllPage = () => {
  const { query, replace, isReady } = useRouter();

  const filter = useMemo(() => {
    return {
      zones: query.zones ? query.zones.toString().split(",") || [] : [],
      grades: query.grades ? query.grades.toString().split(",") || [] : [],
      time: (query.time || defaultTime) as keyof typeof timeOptions,
      timeSort: query.timeSort || defaultTimeSort,
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
      .filter(
        (b) =>
          (!filter.zones.length || filter.zones.includes(b.zone)) &&
          (!filter.grades.length || filter.grades.includes(b.grade)) &&
          b.date > timeFilter
      )
      .sort((a, b) => {
        if (a.date > b.date) return isDesc ? -1 : 1;
        if (a.date < b.date) return isDesc ? 1 : -1;
        return 0;
      });
  }, [allBetas, filter, isReady]);

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
          <HStack pos="sticky" top={0} bg="chakra-body-bg" py={[2, null, 4]}>
            <Menu closeOnSelect={false}>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    size={["sm", null, "md"]}
                    as={Button}
                    leftIcon={<Icon as={FaLocationDot} />}
                    rightIcon={
                      <Icon
                        as={ChevronDownIcon}
                        transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                        transition="transform 0.2s ease-in-out"
                      />
                    }
                  >
                    {!filter.zones.length
                      ? "All"
                      : filter.zones.length > 1
                      ? "Multiple"
                      : getZoneByLabel(filter.zones[0])?.name}
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup title="Walls/Zones" type="checkbox">
                      <SimpleGrid columns={1}>
                        {ZONES.map((z) => (
                          <MenuItemOption
                            key={z.label}
                            value={z.label}
                            isChecked={filter.zones.includes(z.label)}
                            onChange={(v) => {
                              const zones = filter.zones.includes(z.label)
                                ? filter.zones.filter((g) => g !== z.label)
                                : [...filter.zones, z.label];
                              replace({
                                query: {
                                  ...query,
                                  zones: zones.join(","),
                                },
                              });
                            }}
                          >
                            {z.name}
                          </MenuItemOption>
                        ))}
                      </SimpleGrid>
                    </MenuOptionGroup>
                  </MenuList>
                </>
              )}
            </Menu>
            <Menu closeOnSelect={false}>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    size={["sm", null, "md"]}
                    as={Button}
                    leftIcon={<Icon as={FaGraduationCap} />}
                    rightIcon={
                      <Icon
                        as={ChevronDownIcon}
                        transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                        transition="transform 0.2s ease-in-out"
                      />
                    }
                  >
                    {!filter.grades.length ? (
                      "All"
                    ) : filter.grades.length > 1 ? (
                      "Multiple"
                    ) : (
                      <MiniGrade grade={filter.grades[0]} />
                    )}
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup title="Grades" type="checkbox">
                      <SimpleGrid columns={2}>
                        {GRADES_LABEL.map((z) => (
                          <MenuItemOption
                            key={z}
                            value={z}
                            onClick={() => {
                              const grades = filter.grades.includes(z)
                                ? filter.grades.filter((g) => g !== z)
                                : [...filter.grades, z];
                              replace({
                                query: {
                                  ...query,
                                  grades: grades.join(","),
                                },
                              });
                            }}
                            isChecked={filter.grades.includes(z)}
                          >
                            <MiniGrade grade={z} />
                          </MenuItemOption>
                        ))}
                      </SimpleGrid>
                    </MenuOptionGroup>
                  </MenuList>
                </>
              )}
            </Menu>
            <Spacer />
            <Menu closeOnSelect={false}>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    size={["sm", null, "md"]}
                    as={Button}
                    leftIcon={<Icon as={FaClockRotateLeft} />}
                    rightIcon={
                      <HStack>
                        <Icon
                          as={
                            filter.timeSort === "desc"
                              ? FaArrowDownWideShort
                              : FaArrowUpWideShort
                          }
                        />
                        <Icon
                          as={ChevronDownIcon}
                          transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                          transition="transform 0.2s ease-in-out"
                        />
                      </HStack>
                    }
                  >
                    {_.startCase(filter.time)}
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup title="Time Range" type="radio">
                      <SimpleGrid columns={1}>
                        {Object.keys(timeOptions).map((z) => (
                          <MenuItemOption
                            key={z}
                            value={z}
                            isChecked={filter.time === z}
                            onClick={() =>
                              replace({
                                query: {
                                  ...query,
                                  time: z,
                                },
                              })
                            }
                          >
                            {_.startCase(z)}
                          </MenuItemOption>
                        ))}
                      </SimpleGrid>
                    </MenuOptionGroup>
                    <MenuDivider />
                    <MenuOptionGroup
                      title="Time Order"
                      type="radio"
                      onChange={(v) =>
                        replace({
                          query: {
                            ...query,
                            timeSort: v,
                          },
                        })
                      }
                    >
                      <SimpleGrid columns={1}>
                        <MenuItemOption
                          value="desc"
                          isChecked={filter.timeSort === "desc"}
                          onClick={() =>
                            replace({
                              query: {
                                ...query,
                                timeSort: "desc",
                              },
                            })
                          }
                        >
                          Descending
                        </MenuItemOption>
                        <MenuItemOption
                          value="asc"
                          isChecked={filter.timeSort !== "desc"}
                          onClick={() =>
                            replace({
                              query: {
                                ...query,
                                timeSort: "asc",
                              },
                            })
                          }
                        >
                          Ascending
                        </MenuItemOption>
                      </SimpleGrid>
                    </MenuOptionGroup>
                  </MenuList>
                </>
              )}
            </Menu>
          </HStack>
          {isLoading ? (
            <Center h="50dvh">
              <CircularProgress isIndeterminate color="primary.500" />
            </Center>
          ) : (
            <SimpleGrid spacing={4} columns={[1, 3, 5]}>
              {betas.map((b, i) => {
                return (
                  <BetaCard
                    {...b}
                    select={() => setSelectedBeta(b)}
                    key={`${b.id}-${i}`}
                  >
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
