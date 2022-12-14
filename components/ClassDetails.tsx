import { Add } from "@mui/icons-material";
import { Box, Button, Card, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { assignment, bucket, globalData, schoolClass } from "../pages";
import Assignments from "./Assignments";

export function calculateScores(b: bucket): {dropped: number, raw: number} {

    let nonSim = b.assignments.filter(x => !x.simulated);
    let totalNonSimScore = nonSim.reduce((acc, x) => acc + x.score, 0);
    let totalNonSimPoints = nonSim.reduce((acc, x) => acc + x.outOf, 0);


    let simulated = b.assignments.map(x => !x.simulated ? x : {
        ...x,
        score: totalNonSimScore / totalNonSimPoints * x.outOf
    })

    let sorted = simulated.sort((a1, a2) => (a2.score / a2.outOf) - (a1.score / a1.outOf));

    let totalScore = sorted.reduce((acc, x) => acc + x.score, 0);
    let totalPoints = sorted.reduce((acc, x) => acc + x.outOf, 0);

    let dropped = sorted.slice(0, sorted.length - b.drops);

    let totalDroppedScore = dropped.reduce((acc, x) => acc + x.score, 0);
    let totalDroppedPoints = dropped.reduce((acc, x) => acc + x.outOf, 0);


    return {
        dropped: totalDroppedPoints == 0 ? 1 : totalDroppedScore/totalDroppedPoints,
        raw: totalPoints == 0 ? 1 : totalScore/totalPoints
    }
}

export default function ClassDetails(props: any) {

    const data: globalData = props.data;
    const setData = props.setData;
    const selected: schoolClass = props.selected;

    const [selectedBucket, setSelectedBucket] = useState<bucket | null>(null);
    const [selectedAssignment, setSelectedAssignment] = useState<assignment | null>(null);

    function calculateScoreNecessary(): number {
        if (selectedAssignment == null || selectedBucket == null) {
            return 0;
        }

        let totalPercentage = 0;

        for (let b of selected.weights) {
            if (b.id !== selectedBucket.id) {

                totalPercentage += calculateScores(b).dropped * b.percentage;
            }
        }

        totalPercentage /= 100;

        let percentFinalBucketNeeded = (.9 - totalPercentage) / (selectedBucket.percentage / 100);


        // calculate score needed for assignment within bucket

        let assignmentsWithoutSelected = selectedBucket.assignments.filter(x => x.id !== selectedAssignment.id);
        let nonSim = assignmentsWithoutSelected.filter(x => !x.simulated);
        let totalNonSimScore = nonSim.reduce((acc, x) => acc + x.score, 0);
        let totalNonSimPoints = nonSim.reduce((acc, x) => acc + x.outOf, 0);

        let simulated = assignmentsWithoutSelected.map(x => !x.simulated ? x : {
            ...x,
            score: totalNonSimScore / totalNonSimPoints * x.outOf
        })

        let sorted = simulated.sort((a1, a2) => (a2.score / a2.outOf) - (a1.score / a1.outOf));
        let dropped = sorted.slice(0, sorted.length - selectedBucket.drops);

        let totalDroppedScore = dropped.reduce((acc, x) => acc + x.score, 0);
        let totalDroppedPoints = dropped.reduce((acc, x) => acc + x.outOf, 0);

        let percentageAddNecessary = (percentFinalBucketNeeded - (totalDroppedScore / (totalDroppedPoints + selectedAssignment.outOf)))

        return (percentageAddNecessary * (totalDroppedPoints + selectedAssignment.outOf)) / selectedAssignment.outOf;
    }

    function totalGrade(): number {
        let total = 0;

        for (let b of selected.weights) {
            total += calculateScores(b).dropped * b.percentage;
        }

        return total;
    }

    return (
        <Card sx={{ height: '100%', width: '1', p:2 }}>
            <div>
                <h1>{selected.name} Details</h1>
                <Stack direction="column" spacing={2}>
                    <Stack sx={{mt: 4}} direction="row" spacing={2} alignItems="flex-start" justifyContent="space-around"
                        divider={<Divider orientation="vertical" flexItem/>}
                    >
                        {
                            selected.weights.map((x) => (
                                <Box key={x.id}>
                                    <Stack direction="column" spacing={2}>
                                        <Typography fontSize={16} fontWeight="bold" variant="subtitle1">{x.name} ({x.percentage}%)</Typography>

                                        <Assignments data={data} setData={setData} selected={selected} bucket={x} />

                                        {
                                            x.assignments.length != 0 && (
                                                <div>
                                                    <Typography fontSize={16} fontWeight="bold" variant="subtitle1">Average after {x.drops} drops: {(calculateScores(x).dropped * 100).toFixed(2)}%</Typography>
                                                    <Typography fontSize={16} fontWeight="bold" variant="subtitle1">Average without drops: {(calculateScores(x).raw * 100).toFixed(2)}%</Typography>
                                                </div>
                                            )
                                        }
                                    </Stack>
                                </Box>
                            ))
                        }

                    </Stack>

                    <Divider sx={{mt: 4}} />
                    <Box>
                        <Typography textAlign="center" fontSize={20} fontWeight="bold" variant="body1">Total Grade: {totalGrade()}</Typography>
                        <Typography textAlign="center" fontSize={20} fontWeight="bold" variant="body1">Score necessary on selected assignment to get ≥ 90%: {calculateScoreNecessary()}</Typography>
                    </Box>
                </Stack>
            </div>
        </Card>
    )
}
