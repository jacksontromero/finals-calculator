import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormHelperText, InputAdornment, OutlinedInput, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { SyntheticEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { bucket, defaultAssignment, defaultBucket, globalData, schoolClass } from "../pages";

export default function AddClass(props: any) {

    const data: globalData = props.data;
    const setData = props.setData;

    const [open, setOpen] = useState(false);
    const [buckets, setBuckets] = useState([] as bucket[]);

    const [name, setName] = useState("")
    const [courseNumber, setCourseNumber] = useState("")

    useEffect(() => {
        setOpen(localStorage.getItem("data") === null || JSON.parse(localStorage.getItem("data") as string).classes.length === 0)
    }, [])

    function submit(event: SyntheticEvent) {
        event.preventDefault();
        setData({
            ...data,
            classes: [...data.classes, ...[{
                name: name,
                number: courseNumber,
                weights: buckets,
                id: uuidv4(),
                selectedBucket: defaultBucket,
                selectedAssignment: defaultAssignment,
                targetGrade: 90
            } as schoolClass]].sort((a, b) => a.name.localeCompare(b.name))
        })

        setBuckets([])
        setName("")
        setCourseNumber("")

        setOpen(false);
    }

    function updateBucketName(b: bucket, newName: string) {
        setBuckets(buckets.map(x => {
            if (x.id === b.id) {
                return {
                    ...x,
                    name: newName
                }
            } else {
                return x;
            }
        }))
    }

    function updateBucketWeight(b: bucket, newWeight: number) {
        setBuckets(buckets.map(x => {
            if (x.id === b.id) {
                return {
                    ...x,
                    percentage: newWeight
                }
            } else {
                return x;
            }
        }))
    }

    // handle validation that form adds to 100%
    useEffect(() => {
        const submitButton: HTMLObjectElement | null = document.getElementById("add-class-submit-button") as HTMLObjectElement;

        if (buckets.reduce((sum, x) => sum + x.percentage, 0) != 100) {
            submitButton?.setCustomValidity("The sum of all bucket weights must be 100%")
        } else {
            submitButton?.setCustomValidity("")
        }
    }, [buckets])

    function updateBucketDrops(b: bucket, newDrops: number) {
        setBuckets(buckets.map(x => {
            if (x.id === b.id) {
                return {
                    ...x,
                    drops: newDrops
                }
            } else {
                return x;
            }
        }))
    }

    const [bucketsList, setBucketsList] = useState([] as JSX.Element[]);

    useEffect(() => {
        setBucketsList(
            buckets.map((x) => (
                <div key={x.id}>
                    <Stack spacing={1} direction="row">
                        <FormControl sx={{ width: '50%' }}>
                            <OutlinedInput onChange={e => updateBucketName(x, e.target.value)} required defaultValue={x.name}/>
                            <FormHelperText sx={{ml: 1}}>Bucket Name</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ width: '30%' }}>
                            <OutlinedInput onChange={e => updateBucketWeight(x, Number(e.target.value))} required defaultValue={x.percentage} type="number"
                                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                inputProps={{
                                    min: 0,
                                    max: 100,
                                }}
                            />
                            <FormHelperText sx={{ml: 1}}>Percentage</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ width: '20%' }}>
                            <OutlinedInput onChange={e => updateBucketDrops(x, Number(e.target.value))} required defaultValue={x.drops} type="number"
                                inputProps={{
                                    min: 0,
                                }}
                            />
                            <FormHelperText sx={{ml: 1}}>Drops</FormHelperText>
                        </FormControl>
                    </Stack>
                </div>
            ))
        )
    }, [buckets])

    return (
        <div>
            <Button onClick={() => {setOpen(true)}} sx={{ my:2, mx:2, px:2 }} size="large" variant="outlined">Add Class</Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle sx={{fontWeight: "bold", fontSize: "x-large"}}>Add a New Class</DialogTitle>
                <DialogContent>
                    <form onSubmit={submit}>
                        <Stack justifyContent="center" spacing={4} direction={{ xs: 'column', sm: 'row' }} sx={{mt: 6}}>
                            <Stack spacing={2} direction="column">
                                <Typography variant="subtitle1">Class Info</Typography>
                                    <TextField onChange={e => setName(e.target.value)} id="className" variant="outlined" required label="Class Name" />
                                    <TextField onChange={e => setCourseNumber(e.target.value)} id="classNumber" variant="outlined" required label="Class Number" />
                            </Stack>
                            <Stack spacing={2} direction="column">
                                <Typography variant="subtitle1">Weights</Typography>
                                {
                                    bucketsList
                                }
                                <Stack sx={{pt: 2}} justifyContent="space-between" spacing={1} direction="row">
                                    <Button onClick={() => {setBuckets([...buckets, {name: "", percentage: 0, drops:0, assignments: [], id: uuidv4()}])}} sx={{}} size="medium" variant="outlined">Add Bucket</Button>
                                    <Button onClick={() => {setBuckets(buckets.slice(0, -1))}} sx={{}} color="error" size="medium" variant="outlined">Remove Bucket</Button>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Divider sx={{my: 4, mx: 2}}></Divider>
                        <Box textAlign="center">
                            <Button id="add-class-submit-button" type="submit" variant="outlined" color="success" size="large">Add Class</Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
