import React from "react"
import { schoolClass } from "../pages";
import { Box, Card, Divider, IconButton, Stack } from "@mui/material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AddClass from "./AddClass";

export default function Classes(props: any) {

    const {data, setSelected} = props;

    return (
        <Card sx={{ height: '100%', width: '30%', maxWidth: '300px', p:2 }}>
            <div>
                {
                    data.classes.map((x: schoolClass) => (
                        <div key={x.id} >
                            <Card sx={{my: 2, mx: 2, px:2 }}>
                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                    <div>
                                        <h2 >{x.name}</h2>
                                        <p >{x.number}</p>
                                    </div>
                                    <Box >
                                        <IconButton onClick={() => {setSelected(x)}}>
                                            <ArrowRightIcon fontSize="large" />
                                        </IconButton>
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
