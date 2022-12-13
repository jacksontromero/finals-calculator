import { Add } from "@mui/icons-material";
import { Box, Card, Divider, IconButton, Stack, Typography } from "@mui/material";
import { assignment, bucket, schoolClass } from "../pages";
import Assignments from "./Assignments";

export default function ClassDetails(props: any) {

    const data = props.data;
    const setData = props.setData;
    const selected: schoolClass = props.selected;

    function calculateAverage(b: bucket): number {
        let sorted = [...b.assignments].sort((a1, a2) => (a2.score / a2.outOf) - (a1.score / a1.outOf));
        let dropped = sorted.slice(0, sorted.length - b.drops);

        console.log(dropped)

        let totalScore = dropped.reduce((acc, x) => acc + x.score, 0);
        let totalPoints = dropped.reduce((acc, x) => acc + x.outOf, 0);

        console.log(totalScore, totalPoints)

        return totalPoints == 0 ? 1 : totalScore/totalPoints;
    }

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
                                        x.assignments.length != 0 && <Typography fontSize={16} fontWeight="bold" variant="subtitle1">Average After {x.drops} drops: {parseFloat(calculateAverage(x).toFixed(4)) * 100}%</Typography>
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
