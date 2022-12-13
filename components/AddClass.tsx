import { Backdrop, Box, Button, Divider, Fade, FormControl, Modal, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { SyntheticEvent, useState } from "react";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

export default function AddClass(props: any) {

    const {data, setData} = props;

    const [open, setOpen] = useState(false);
    const [buckets, setBuckets] = useState([] as {name: string, percentage: number, drops: number}[]);

    const [name, setName] = useState("")
    const [courseNumber, setCourseNumber] = useState("")

    function submit(event: SyntheticEvent) {
        event.preventDefault();
        setData({
            ...data,
            classes: [...data.classes, {
                name: name,
                number: courseNumber,
                weights: buckets
            }]
        })

        setOpen(false);
    }

    return (
        <div>
            <Button onClick={() => {setOpen(true)}} sx={{ my:2, mx:2, px:2 }} size="large" variant="outlined">Add Class</Button>

            <Modal
                open={open}
                onClose={() => {setOpen(false)}}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div>
                        <Box sx={style}>
                            <h1>Add a New Class</h1>
                            <form onSubmit={submit}>
                                <Stack justifyContent="center" spacing={4} direction="row" sx={{mt: 6}}>
                                    <Stack spacing={2} direction="column">
                                        <Typography variant="subtitle1">Class Info</Typography>
                                            <TextField onChange={e => setName(e.target.value)} id="className" variant="outlined" required label="Class Name" />
                                            <TextField onChange={e => setCourseNumber(e.target.value)} id="classNumber" variant="outlined" required label="Class Number" />
                                    </Stack>
                                    <Stack spacing={2} direction="column">
                                        <Typography variant="subtitle1">Weights</Typography>
                                            {
                                                buckets.map((x, i) => (
                                                    <div key={i}>
                                                        <Stack spacing={1} direction="row">
                                                            <TextField id="bucketName" variant="outlined" required label="Bucket Name" defaultValue={x.name}/>
                                                            <TextField id="bucketPercentage" variant="outlined" type="number" required label="Bucket Percentage" defaultValue={x.percentage} InputProps={{
                                                                inputProps: {
                                                                    min: 0,
                                                                    max: 100
                                                                }
                                                            }} />
                                                            <TextField id="bucketDrops" variant="outlined" type="number" required label="Bucket Drops" defaultValue={x.drops} InputProps={{
                                                                inputProps: {
                                                                    min: 0,
                                                                }
                                                            }} />
                                                        </Stack>
                                                    </div>
                                                ))
                                            }
                                        <Stack sx={{pt: 2}} justifyContent="space-between" spacing={1} direction="row">
                                            <Button onClick={() => {setBuckets([...buckets, {name: "", percentage: 0, drops:0}])}} sx={{}} size="medium" variant="outlined">Add Bucket</Button>
                                            <Button onClick={() => {setBuckets(buckets.slice(0, -1))}} sx={{}} color="error" size="medium" variant="outlined">Remove Bucket</Button>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Divider sx={{my: 4, mx: 2}}></Divider>
                                <Box textAlign="center">
                                    <Button type="submit" variant="outlined" color="success" size="large">Add Class</Button>
                                </Box>
                            </form>
                        </Box>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}
