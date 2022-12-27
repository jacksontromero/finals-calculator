import React from "react"
import { schoolClass } from "../pages";
import { Box, Card, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AddClass from "./AddClass";
import EditClass from "./EditClass";

export default function Classes(props: any) {

    const {data, setSelectedClassID} = props;

    return (
        <Card variant="elevation" sx={{ height: '100%', width: 'auto', maxWidth: '300px', p:2 }}>
            <Typography variant="h4" fontWeight="bold">All Classes</Typography>
            <div>
                {
                    data.classes.map((x: schoolClass) => (
                        <div key={x.id} >
                            <Card variant="filled" sx={{my: 2, mx: 2, px:2 }}>
                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                    <div>
                                        <h3 >{x.name}</h3>
                                        <p >{x.number}</p>
                                    </div>
                                    <Stack direction="column" spacing={0} alignItems="center">
                                        <Box >
                                            <Tooltip placement="top" title="Select this class">
                                                <IconButton onClick={() => {setSelectedClassID(x.id)}}>
                                                    <ArrowRightIcon fontSize="large" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <EditClass classID={x.id} {...props} />
                                    </Stack>
                                </Stack>
                            </Card>
                        </div>
                    ))
                }
            </div>

            <Divider></Divider>

            <AddClass {...props}></AddClass>
        </Card>
    )
}
