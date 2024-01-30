import { ZONES, getZoneByLabel } from "@/constants/zones";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FaArrowDownWideShort,
  FaArrowUpWideShort,
  FaClockRotateLeft,
  FaGraduationCap,
  FaLocationDot,
} from "react-icons/fa6";
import { MiniGrade } from "./MiniGrade";
import { GRADES_LABEL } from "@/constants/grades";
import _ from "lodash";
import { timeOptions } from "@/views/pages/AllPage";
import { useCallback } from "react";

export const FilterBar = (filter: {
  zones: string[];
  grades: string[];
  time: string;
  timeSort: string;
}) => {
  const { query, replace } = useRouter();

  const onSearchChange = useCallback(
    _.debounce((s: string) => {
      replace({
        query: {
          ...query,
          search: s,
        },
      });
    }, 1000),
    []
  );

  return (
    <Stack
      pos="sticky"
      top={0}
      bg="chakra-body-bg"
      py={4}
      direction={["column", "row"]}
    >
      <HStack>
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
                        onClick={() => {
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
                {_.startCase(filter.time).slice(0, 3).replace(" ", "")}
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
                <MenuOptionGroup title="Time Order" type="radio">
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
      <Spacer />
      <Input
        size={["sm", null, "md"]}
        maxW={["full", "2xs"]}
        placeholder="@instagram"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Stack>
  );
};
