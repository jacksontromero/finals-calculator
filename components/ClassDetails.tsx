import { Add } from "@mui/icons-material";
import { Box, Card, Divider, IconButton, Stack, Typography } from "@mui/material";
import { assignment, bucket, schoolClass } from "../pages";
import Assignments from "./Assignments";

export function calculateAverages(b: bucket): {dropped: number, raw: number} {

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

    const data = props.data;
    const setData = props.setData;
    const selected: schoolClass = props.selected;

    return (
        <Card sx={{ height: '100%', width: '1', p:2 }}>
            <div>
                <h1>{selected.name} Details</h1>
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
                                                <Typography fontSize={16} fontWeight="bold" variant="subtitle1">Average after {x.drops} drops: {(calculateAverages(x).dropped * 100).toFixed(2)}%</Typography>
                                                <Typography fontSize={16} fontWeight="bold" variant="subtitle1">Average without drops: {(calculateAverages(x).raw * 100).toFixed(2)}%</Typography>
                                            </div>
                                        )
                                    }
                                </Stack>
                            </Box>
                        ))
                    }
                </Stack>
            </div>
        </Card>
    )
}
