import { GitHub } from "@mui/icons-material";
import { Divider, Link, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Footer() {
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
                <Typography>Created by Jackson Romero</Typography>
                <Link href={"https://github.com/jacksontromero/finals-calculator"} target="_blank">
                    <GitHub sx={{color: "black"}} />
                </Link>
            </Stack>
        </Box>
    )
}
