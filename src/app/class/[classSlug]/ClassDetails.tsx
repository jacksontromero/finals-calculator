'use client';

import { useEffect, useState } from 'react';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { assignment, bucket, SelectingStates, useDataStore } from '@/app/store';
import { Input } from '../../../components/ui/input';
import { H3, H4, P } from '../../../components/ui/typography';
import { Separator } from '../../../components/ui/separator';
import { Button } from '../../../components/ui/button';
import Bucket from './Bucket';

export function calculateScores(b: bucket): { dropped: number; raw: number } {
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

function calculateScoreNecessary(
  selectedAssignment: assignment | null,
  selectedBucket: bucket | null,
  weights: bucket[],
  targetGrade: number
): number {
  if (selectedAssignment == null || selectedBucket == null) {
    return 0;
  }

  let totalPercentage = 0;

  for (let b of weights) {
    if (b.id !== selectedBucket.id) {
      totalPercentage += calculateScores(b).dropped * b.percentage;
    }
  }

  totalPercentage /= 100;

  let percentFinalBucketNeeded =
    (targetGrade / 100 - totalPercentage) / (selectedBucket.percentage / 100);

  // calculate score needed for assignment within bucket

  let assignmentsWithoutSelected = selectedBucket.assignments.filter(
    (x) => x.id !== selectedAssignment?.id
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
  let dropped = sorted.slice(0, sorted.length - selectedBucket.drops);

  let totalDroppedScore = dropped.reduce((acc, x) => acc + x.score, 0);
  let totalDroppedPoints = dropped.reduce((acc, x) => acc + x.outOf, 0);

  let percentageAddNecessary =
    percentFinalBucketNeeded -
    totalDroppedScore / (totalDroppedPoints + selectedAssignment.outOf);

  let percentageForTarget =
    (percentageAddNecessary * (totalDroppedPoints + selectedAssignment.outOf)) /
    selectedAssignment.outOf;
  return percentageForTarget < 0 ? 0 : percentageForTarget;
}

function totalGrade(weights: bucket[]): number {
  let total = 0;

  for (let b of weights) {
    total += calculateScores(b).dropped * b.percentage;
  }

  return total;
}

export default function ClassDetails(params: { classId: string }) {
  const classId = params.classId;

  const name = useDataStore((state) => state.classes[classId].name);
  const selectingState = useDataStore(
    (state) => state.classes[classId].selectingState
  );
  const selectedAssignment = useDataStore(
    (state) => state.classes[classId].selectedAssignment
  );
  const selectedBucket = useDataStore(
    (state) => state.classes[classId].selectedBucket
  );
  const weights = useDataStore((state) => state.classes[classId].weights);
  const targetGrade = useDataStore(
    (state) => state.classes[classId].targetGrade
  );

  const setTargetGrade = useDataStore((state) => state.setTargetGrade);
  const resetSelectAssignment = useDataStore(
    (state) => state.resetSelectAssignment
  );
  const pickSelectedAssignment = useDataStore(
    (state) => state.pickSelectedAssignment
  );

  const [targetGradeBox, setTargetGradeBox] = useState(
    null as JSX.Element | null
  );

  useEffect(() => {
    setTargetGradeBox(
      <Input
        onChange={(e) => setTargetGrade(classId, Number(e.target.value))}
        type="number"
        defaultValue={targetGrade}
        min={0}
        onFocus={(e) => {
          e.target.select();
        }}
        onWheel={(e) => (e.target as HTMLElement).blur()}
      />
    );
  }, [targetGrade]);

  const screenWidth = useWindowWidth();
  let widthPerBucket = screenWidth / weights.length;

  return (
    <div className="p-2 w-full">
      <H4>{name} Details</H4>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row mt-4 justify-around w-full h-full">
          {weights.map((x, i) => (
            <div key={x.id}>
              <Bucket classId={classId} x={x} i={i} />
            </div>
          ))}
        </div>

        <Separator className="mt-4" />
        <div className="flex flex-col gap-2 items-center justify-center">
          <H3 className="text-center mb-4">
            Total Grade: {totalGrade(weights).toFixed(2)}%
          </H3>
          <div className="flex flex-row gap-1 justify-center items-center">
            {targetGradeBox}
            <Button
              size="lg"
              variant={
                selectingState == SelectingStates.SELECTING
                  ? 'default'
                  : 'outline'
              }
              onClick={() => {
                if (selectingState == SelectingStates.SELECTING) {
                  resetSelectAssignment(classId, SelectingStates.FIRST_LOAD);
                } else {
                  resetSelectAssignment(classId, SelectingStates.SELECTING);
                }
              }}
            >
              {selectingState == SelectingStates.SELECTING
                ? 'Cancel Selection'
                : 'Select Target Assignment'}
            </Button>
          </div>
          {selectingState == SelectingStates.SELECTED && (
            <P className="text-center font-bold text-lg">
              Score necessary on selected assignment to get ≥ {targetGrade}%:{' '}
              {(
                calculateScoreNecessary(
                  selectedAssignment,
                  selectedBucket,
                  weights,
                  targetGrade
                ) * 100
              ).toFixed(2)}
            </P>
          )}
        </div>
      </div>
    </div>
  );
}
