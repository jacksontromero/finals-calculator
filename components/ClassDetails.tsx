import { Add } from "@mui/icons-material";
import { Box, Card, Divider, IconButton, Stack, Typography } from "@mui/material";
import { schoolClass } from "../pages";
import Assignments from "./Assignments";

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
                        selected.weights.map((x, i) => (
                            <Box key={i}>
                                <Stack direction="column" spacing={2}>
                                    <Typography fontSize={16} fontWeight="bold" variant="subtitle1">{x.name} ({x.percentage}%)</Typography>

                                    <Assignments data={data} setData={setData} selected={selected} bucket={x} />

                                    {
                                        x.assignments.length != 0 && <Typography fontSize={16} fontWeight="bold" variant="subtitle1">Category Average</Typography>
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
