import React from "react"
import { schoolClass } from "../pages";
import Button from '@mui/material/Button';
import { Card, Divider } from "@mui/material";
import AddClass from "./AddClass";

export default function Classes(props: any) {

    const {data} = props;

    return (
        <Card sx={{ height: '100%', width: '50%', m:2, p:2 }}>
            <div>
                {
                    data.classes.map((x: schoolClass) => (
                        <div key={x.number} >
                            <Card sx={{my: 2, mx: 2, px:2 }}>
                                <h2 >{x.name}</h2>
                                <p >{x.number}</p>
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
