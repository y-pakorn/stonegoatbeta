import {
  COMP_GRADES,
  formatCompGradeWithSex,
  formatGradeLabelSep,
} from "@/constants/grades";
import { chakra } from "@chakra-ui/react";
import _ from "lodash";

export const MiniGrade = ({ grade }: { grade: string }) => {
  const comp = formatCompGradeWithSex(grade);
  const [label, icon] = formatGradeLabelSep(grade);

  if (comp)
    return (
      <chakra.span bg={COMP_GRADES[comp[0]].color} px={2} color="white" as="b">
        {COMP_GRADES[comp[0]].icon} {_.startCase(comp[1])}
      </chakra.span>
    );
  return <>{icon || label}</>;
};
