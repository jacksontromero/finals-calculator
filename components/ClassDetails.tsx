import { Add } from "@mui/icons-material";
import { Box, Button, Card, Divider, IconButton, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { assignment, bucket, defaultAssignment, defaultBucket, globalData, schoolClass } from "../pages";
import Assignments from "./Assignments";
import { v4 as uuidv4 } from 'uuid';

export default function ClassDetails(props: any) {

    const data: globalData = props.data;
    const setData = props.setData;
    const selected: schoolClass = props.selected;

    function calculateScores(b: bucket): {dropped: number, raw: number} {

        let nonSim = b.assignments.filter(x => !x.simulated);
        let totalNonSimScore = nonSim.reduce((acc, x) => acc + x.score, 0);
        let totalNonSimPoints = nonSim.reduce((acc, x) => acc + x.outOf, 0);


        let simulated = b.assignments.map(x => !x.simulated ? x : {
            ...x,
            score: totalNonSimPoints == 0 ? 0 : totalNonSimScore / totalNonSimPoints * x.outOf
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

    function calculateScoreNecessary(): number {
        if (selected.selectedAssignment == null || selected.selectedBucket == null) {
            return 0;
        }

        let totalPercentage = 0;

        for (let b of selected.weights) {
            if (b.id !== selected.selectedBucket.id) {

                totalPercentage += calculateScores(b).dropped * b.percentage;
            }
        }

        totalPercentage /= 100;

        let percentFinalBucketNeeded = ((selected.targetGrade / 100) - totalPercentage) / (selected.selectedBucket.percentage / 100);


        // calculate score needed for assignment within bucket

        let assignmentsWithoutSelected = selected.selectedBucket.assignments.filter(x => x.id !== selected.selectedAssignment?.id);
        let nonSim = assignmentsWithoutSelected.filter(x => !x.simulated);
        let totalNonSimScore = nonSim.reduce((acc, x) => acc + x.score, 0);
        let totalNonSimPoints = nonSim.reduce((acc, x) => acc + x.outOf, 0);

        let simulated = assignmentsWithoutSelected.map(x => !x.simulated ? x : {
            ...x,
            score: totalNonSimPoints == 0 ? 0 : totalNonSimScore / totalNonSimPoints * x.outOf
        })

        let sorted = simulated.sort((a1, a2) => (a2.score / a2.outOf) - (a1.score / a1.outOf));
        let dropped = sorted.slice(0, sorted.length - selected.selectedBucket.drops);

        let totalDroppedScore = dropped.reduce((acc, x) => acc + x.score, 0);
        let totalDroppedPoints = dropped.reduce((acc, x) => acc + x.outOf, 0);

        let percentageAddNecessary = (percentFinalBucketNeeded - (totalDroppedScore / (totalDroppedPoints + selected.selectedAssignment.outOf)))

        let percentageForTarget = (percentageAddNecessary * (totalDroppedPoints + selected.selectedAssignment.outOf)) / selected.selectedAssignment.outOf;
        return percentageForTarget < 0 ? 0 : percentageForTarget;
    }

    function totalGrade(): number {
        let total = 0;

        for (let b of selected.weights) {
            total += calculateScores(b).dropped * b.percentage;
        }

        return total;
    }

    function setSelectedAssignment(a: assignment | null) {
        setData((prevData: globalData) => {
            prevData.classes.filter(x => x.id === selected.id)[0].selectedAssignment = a;

            return ({
                ...prevData
            })
        })
    }

    function setSelectedBucket(b: bucket | null) {
        setData((prevData: globalData) => {
            prevData.classes.filter(x => x.id === selected.id)[0].selectedBucket = b;

            return ({
                ...prevData
            })
        })
    }

    function removeSelectedAssignment() {
        setSelectedAssignment(null);
        setSelectedBucket(null);
    }

    function pickSelectedAssignment(a: assignment, b: bucket) {

        if (selected.selectedAssignment == null && selected.selectedBucket == null) {
            setSelectedAssignment(a);
            setSelectedBucket(b);
        }
    }

    function setTargetGrade(newTarget: number) {
        setData((prevData: globalData) => {
            prevData.classes.filter(x => x.id === selected.id)[0].targetGrade = newTarget;

            return ({
                ...prevData
            })
        })
    }

    const [targetGradeBox, setTargetGradeBox] = useState(null as JSX.Element | null)

    useEffect(() => {
        setTargetGradeBox(
            <TextField onChange={e => setTargetGrade(Number(e.target.value))} variant="outlined" label="Target Grade" type="number" defaultValue={selected.targetGrade} InputProps={{
                inputProps: {
                    min: 0,
                }
            }} onFocus={
                (e) => {
                    e.target.select();
                }
            }/>
        )
    }, [selected.targetGrade])

    const theme = useTheme();

    return (
        <Card sx={{ height: '100%', width: '1', p:2 }}>
            <div>
                <h1>{selected.name} Details</h1>
                <Stack direction="column" spacing={2}>
                    <Stack sx={{mt: 4}} direction={useMediaQuery(theme.breakpoints.down("md")) ? "column" : "row"} spacing={1} alignItems="flex-start" justifyContent="space-around"
                        divider={
                            <Divider
                                orientation={useMediaQuery(theme.breakpoints.down("md")) ? "horizontal" : "vertical"}
                                flexItem
                            />
                        }
                    >
                        {
                            selected.weights.map((x) => (
                                <Box key={x.id}>
                                    <Stack direction="column" alignItems="flex-start" spacing={1}>
                                        <Typography fontSize={16} fontWeight="bold" variant="subtitle1">{x.name} ({x.percentage}%)</Typography>

                                        <Assignments data={data} setData={setData} selected={selected} bucket={x} removeSelectedAssignment={removeSelectedAssignment} pickSelectedAssignment={pickSelectedAssignment}/>

                                        {
                                            x.assignments.length != 0 && (
                                                <div>
                                                    {
                                                        x.drops != 0 && <Typography fontSize={16} fontWeight="bold" variant="subtitle1">Average after {x.drops} drops: {(calculateScores(x).dropped * 100).toFixed(2)}%</Typography>
                                                    }
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
                    <Stack direction="column" spacing={2} alignItems="center" justifyContent="center">
                        <Typography sx={{mb: 4}} textAlign="center" fontSize={20} fontWeight="bold" variant="h2">Total Grade: {totalGrade().toFixed(2)}%</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                            {
                                targetGradeBox
                            }
                            <Button size="large" variant={selected.selectedAssignment == null ? "contained" : "outlined"}
                                onClick={() => {
                                    if (selected.selectedAssignment != null) {
                                        removeSelectedAssignment();
                                    }
                                    else {
                                        pickSelectedAssignment(defaultAssignment, defaultBucket);
                                    }
                                }}
                            >
                                    Select Target Assignment
                            </Button>
                        </Stack>
                        {
                            (selected.selectedAssignment != null && selected.selectedAssignment.id != defaultAssignment.id) && (
                                <Typography textAlign="center" fontSize={20} fontWeight="bold" variant="body1">Score necessary on selected assignment to get ≥ {selected.targetGrade}%: {(calculateScoreNecessary() * 100).toFixed(2)}</Typography>
                            )
                        }
                    </Stack>
                </Stack>
            </div>
        </Card>
    )
}
