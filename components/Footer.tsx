import { GitHub, LightModeRounded, NightsStayRounded } from "@mui/icons-material";
import { Divider, IconButton, Link, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext } from "react";
import { ColorModeContext } from "../pages/_app";

export default function Footer() {

    const {mode, setMode} = useContext(ColorModeContext);

    return (
        <Box sx={{height: "50px", mt: 2, content: '""', display: "block"}}>
            <Stack direction='row'
                alignItems='center'
                divider={<Divider orientation="vertical" flexItem />}
                spacing={1}
                justifyContent='center'
                // position='fixed'
                sx={{ bottom: 5, width: '100%'}}
            >
                <IconButton onClick={() => {setMode(mode === "dark" ? "light" : "dark")}}>
                    {
                        (mode === "dark") ? <NightsStayRounded/> : <LightModeRounded />
                    }
                </IconButton>
                <Typography>Created by Jackson Romero</Typography>
                <Link href={"https://github.com/jacksontromero/finals-calculator"} target="_blank">
                    <GitHub sx={{color: mode === "dark" ? "white" : "black"}} />
                </Link>
            </Stack>
        </Box>
    )
}
