export const ZONES = [
  {
    name: "Competition",
    image: "/images/zones/comp.jpeg",
    label: "comp-wall",
    tooltip: "Long wall on the left",
  },
  {
    name: "Island",
    image: "/images/zones/island.jpeg",
    label: "island",
    tooltip: null,
  },
  {
    name: "Khonkaen",
    image: "/images/zones/khonkaen.jpeg",
    label: "khonkaen",
    tooltip: "2nd floor",
  },
  {
    name: "Railay",
    image: "/images/zones/railay.jpeg",
    label: "railay",
    tooltip: "Topout wall inside",
  },
  {
    name: "Sikhio",
    image: "/images/zones/sikhio.jpeg",
    label: "sikhio",
    tooltip: "First wall to the right",
  },
  {
    name: "Tonsai",
    image: "/images/zones/tonsai.jpeg",
    label: "tonsai",
    tooltip: "Overhang",
  },
] as const;

export const getZoneByLabel = (label: string) => {
  return ZONES.find((zone) => zone.label === label);
};

export const ZONES_REGEX =
  /#(comp-wall)|(island)|(khonkaen)|(railay)|(sikhio)|(tonsai)/g;
