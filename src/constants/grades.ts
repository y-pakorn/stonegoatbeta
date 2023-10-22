import _ from "lodash";

export const GRADES = {
  red: {
    label: "Red",
    icon: "🟥",
  },
  orange: {
    label: "Orange",
    icon: "🟧",
  },
  yellow: {
    label: "Yellow",
    icon: "🟨",
  },
  green: {
    label: "Green",
    icon: "🟩",
  },
  blue: {
    label: "Blue",
    icon: "🟦",
  },
  purple: {
    label: "Purple",
    icon: "🟪",
  },
  black: {
    label: "Black",
    icon: "⬛",
  },
  white: {
    label: "White",
    icon: "⬜",
  },
} as const;

export const formatGradeLabel = (grade: string) => {
  if (grade.startsWith("silverhorn") || grade.startsWith("ibex")) {
    return _.startCase(grade.replace(/-/g, " "));
  }

  /// remove '-' and 'tag' from grade and add icon
  /// e.g. 'red-tag' -> 'Red 🟥', 'red-orange' -> 'Red Orange 🟥🟧'
  const gradeLabel = grade
    .replace(/-tag/g, "")
    .split("-")
    .map((word) => _.startCase(word));
  const gradeIcon = _.map(
    gradeLabel,
    (label) => GRADES[_.lowerCase(label) as keyof typeof GRADES].icon
  );
  return `${gradeLabel.join(" ")} ${gradeIcon.join(" ")}`;
};

export const GRADES_LABEL = [
  "red-tag",
  "red-orange",
  "orange-tag",
  "orange-yellow",
  "yellow-tag",
  "yellow-green",
  "green-tag",
  "green-blue",
  "blue-tag",
  "blue-purple",
  "purple-tag",
  "purple-black",
  "black-tag",
  "black-white",
  "white-tag",
  "silverhorn-m",
  "silverhorn-f",
  "ibex-m",
  "ibex-f",
] as const;

export const GRADES_REGEX =
  /#(reg-tag)|(red-orange)|(orange-tag)|(orange-yellow)|(yellow-tag)|(yellow-green)|(green-tag)|(green-blue)|(blue-tag)|(blue-purple)|(purple-tag)|(purple-black)|(black-tag)|(black-white)|(white-tag)/g;

export const COMP_GRADES_REGEX = /#((silverhorn|ibex)-(f|m))[1-9]/g;

export const MONTHS_LABEL = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export const MONTHS_REGEX =
  /#(january)|(february)|(march)|(april)|(may)|(june)|(july)|(august)|(september)|(october)|(november)|(december)/g;

export const INSTAGRAM_HANDLE_REGEX = /^@[a-zA-Z0-9._]+/g;