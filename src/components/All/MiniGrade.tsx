import { formatGradeLabelSep } from "@/constants/grades";
import { chakra } from "@chakra-ui/react";
import _ from "lodash";

export const MiniGrade = ({ grade }: { grade: string | null }) => {
  const [label, icon] = formatGradeLabelSep(grade);

  return <>{icon || label}</>;
};
