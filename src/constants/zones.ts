export const ZONES = [
  {
    name: "Competition",
    image: "/images/zones/comp.jpeg",
    label: "comp-wall",
  },
  {
    name: "Island",
    image: "/images/zones/island.jpeg",
    label: "island",
  },
  {
    name: "Khonkaen",
    image: "/images/zones/khonkaen.jpeg",
    label: "khonkaen",
  },
  {
    name: "Railay",
    image: "/images/zones/railay.jpeg",
    label: "railay",
  },
  {
    name: "Sikhio",
    image: "/images/zones/sikhio.jpeg",
    label: "sikhio",
  },
  {
    name: "Tonsai",
    image: "/images/zones/tonsai.jpeg",
    label: "tonsai",
  },
] as const;

export const getZoneByLabel = (label: string) => {
  return ZONES.find((zone) => zone.label === label);
};

export const ZONES_REGEX =
  /#(comp-wall)|(island)|(khonkaen)|(railay)|(sikhio)|(tonsai)/g;
