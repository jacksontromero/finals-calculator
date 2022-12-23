import React from "react"
import { schoolClass } from "../pages";
import { Box, Card, Divider, IconButton, Stack, Tooltip } from "@mui/material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AddClass from "./AddClass";

export default function Classes(props: any) {

    const {data, setSelected} = props;

    return (
        <Card sx={{ height: '100%', width: 'auto', maxWidth: '300px', p:2 }}>
            <h1>All Classes</h1>
            <div>
                {
                    data.classes.map((x: schoolClass) => (
                        <div key={x.id} >
                            <Card sx={{my: 2, mx: 2, px:2 }}>
                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                    <div>
                                        <h3 >{x.name}</h3>
                                        <p >{x.number}</p>
                                    </div>
                                    <Box >
                                        <Tooltip title="Select this class">
                                            <IconButton onClick={() => {setSelected(x)}}>
                                                <ArrowRightIcon fontSize="large" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
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
