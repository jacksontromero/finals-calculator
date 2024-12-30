"use client";

import { useEffect, useState } from "react";
import Assignments from "./Assignments";
import { useWindowWidth } from "@react-hook/window-size/throttled";
import {
  bucket,
  defaultAssignment,
  defaultBucket,
  useDataStore,
} from "@/app/store";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { H2, H3, H4, P } from "./ui/typography";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

export default function ClassDetails(params: { classId: string }) {
  const classId = params.classId;
  const classData = useDataStore((state) => state.classes[classId]);
  const setTargetGrade = useDataStore((state) => state.setTargetGrade);
  const removeSelectedAssignment = useDataStore(
    (state) => state.removeSelectedAssignment
  );
  const pickSelectedAssignment = useDataStore(
    (state) => state.pickSelectedAssignment
  );

  function calculateScores(b: bucket): { dropped: number; raw: number } {
    let nonSim = b.assignments.filter((x) => !x.simulated);
    let totalNonSimScore = nonSim.reduce((acc, x) => acc + x.score, 0);
    let totalNonSimPoints = nonSim.reduce((acc, x) => acc + x.outOf, 0);

    let simulated = b.assignments.map((x) =>
      !x.simulated
        ? x
        : {
            ...x,
            score:
              totalNonSimPoints == 0
                ? 0
                : (totalNonSimScore / totalNonSimPoints) * x.outOf,
          }
    );

    let sorted = simulated.sort(
      (a1, a2) => a2.score / a2.outOf - a1.score / a1.outOf
    );

    let totalScore = sorted.reduce((acc, x) => acc + x.score, 0);
    let totalPoints = sorted.reduce((acc, x) => acc + x.outOf, 0);

    let dropped = sorted.slice(0, sorted.length - b.drops);

    let totalDroppedScore = dropped.reduce((acc, x) => acc + x.score, 0);
    let totalDroppedPoints = dropped.reduce((acc, x) => acc + x.outOf, 0);

    return {
      dropped:
        totalDroppedPoints == 0 ? 1 : totalDroppedScore / totalDroppedPoints,
      raw: totalPoints == 0 ? 1 : totalScore / totalPoints,
    };
  }

  function calculateScoreNecessary(): number {
    if (
      classData.selectedAssignment == null ||
      classData.selectedBucket == null
    ) {
      return 0;
    }

    let totalPercentage = 0;

    for (let b of classData.weights) {
      if (b.id !== classData.selectedBucket.id) {
        totalPercentage += calculateScores(b).dropped * b.percentage;
      }
    }

    totalPercentage /= 100;

    let percentFinalBucketNeeded =
      (classData.targetGrade / 100 - totalPercentage) /
      (classData.selectedBucket.percentage / 100);

    // calculate score needed for assignment within bucket

    let assignmentsWithoutSelected =
      classData.selectedBucket.assignments.filter(
        (x) => x.id !== classData.selectedAssignment?.id
      );
    let nonSim = assignmentsWithoutSelected.filter((x) => !x.simulated);
    let totalNonSimScore = nonSim.reduce((acc, x) => acc + x.score, 0);
    let totalNonSimPoints = nonSim.reduce((acc, x) => acc + x.outOf, 0);

    let simulated = assignmentsWithoutSelected.map((x) =>
      !x.simulated
        ? x
        : {
            ...x,
            score:
              totalNonSimPoints == 0
                ? 0
                : (totalNonSimScore / totalNonSimPoints) * x.outOf,
          }
    );

    let sorted = simulated.sort(
      (a1, a2) => a2.score / a2.outOf - a1.score / a1.outOf
    );
    let dropped = sorted.slice(
      0,
      sorted.length - classData.selectedBucket.drops
    );

    let totalDroppedScore = dropped.reduce((acc, x) => acc + x.score, 0);
    let totalDroppedPoints = dropped.reduce((acc, x) => acc + x.outOf, 0);

    let percentageAddNecessary =
      percentFinalBucketNeeded -
      totalDroppedScore /
        (totalDroppedPoints + classData.selectedAssignment.outOf);

    let percentageForTarget =
      (percentageAddNecessary *
        (totalDroppedPoints + classData.selectedAssignment.outOf)) /
      classData.selectedAssignment.outOf;
    return percentageForTarget < 0 ? 0 : percentageForTarget;
  }

  function totalGrade(): number {
    let total = 0;

    for (let b of classData.weights) {
      total += calculateScores(b).dropped * b.percentage;
    }

    return total;
  }

  const [targetGradeBox, setTargetGradeBox] = useState(
    null as JSX.Element | null
  );

  useEffect(() => {
    setTargetGradeBox(
      <Input
        onChange={(e) => setTargetGrade(classId, Number(e.target.value))}
        type="number"
        defaultValue={classData.targetGrade}
        min={0}
        onFocus={(e) => {
          e.target.select();
        }}
        onWheel={(e) => (e.target as HTMLElement).blur()}
      />
    );
  }, [classData.targetGrade]);

  const screenWidth = useWindowWidth();
  let widthPerBucket = screenWidth / classData.weights.length;

  return (
    <div className="p-2 w-full">
      <H4>{classData.name} Details</H4>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row mt-4 justify-around w-full h-full">
          {classData.weights.map((x, i) => (
            <div key={x.id} className="flex flex-row min-h-full">
              {i != 0 && <Separator orientation="vertical" className="mx-2" />}
              <div className="flex flex-col gap-1 align-start">
                <P className="font-bold text-md">
                  {x.name} ({x.percentage}%)
                </P>

                <Assignments classData={classData} bucket={x} />

                {x.assignments.length != 0 && (
                  <div>
                    {x.drops != 0 && (
                      <P className="text-md !mt-4">
                        Average after {x.drops} drops:{" "}
                        {(calculateScores(x).dropped * 100).toFixed(2)}%
                      </P>
                    )}
                    <P className="text-md !mt-2">
                      Average without drops:{" "}
                      {(calculateScores(x).raw * 100).toFixed(2)}%
                    </P>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator className="mt-4" />
        <div className="flex flex-col gap-2 items-center justify-center">
          <H3 className="text-center mb-4">
            Total Grade: {totalGrade().toFixed(2)}%
          </H3>
          <div className="flex flex-row gap-1 justify-center items-center">
            {targetGradeBox}
            <Button
              size="lg"
              variant={
                classData.selectedAssignment == null ? "default" : "outline"
              }
              onClick={() => {
                if (classData.selectedAssignment != null) {
                  removeSelectedAssignment(classId);
                } else {
                  pickSelectedAssignment(
                    classId,
                    defaultAssignment(),
                    defaultBucket()
                  );
                }
              }}
            >
              Select Target Assignment
            </Button>
          </div>
          {classData.selectedAssignment != null && (
            <P className="text-center font-bold text-lg">
              Score necessary on selected assignment to get ≥{" "}
              {classData.targetGrade}%:{" "}
              {(calculateScoreNecessary() * 100).toFixed(2)}
            </P>
          )}
        </div>
      </div>
    </div>
  );
}
