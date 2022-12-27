import { EditRounded } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormHelperText, IconButton, InputAdornment, OutlinedInput, TextField, Tooltip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { SyntheticEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { bucket, defaultAssignment, defaultBucket, globalData } from "../pages";

export default function EditClass(props: any) {

    const data: globalData = props.data;
    const setData = props.setData;

    const selectedClassID = props.selectedClassID;
    const setSelectedClassID = props.setSelectedClassID;

    const [currentClass, setCurrentClass] = useState(data.classes.filter(x => x.id === props.classID)[0]);

    useEffect(() => {
        setCurrentClass(data.classes.filter(x => x.id === props.classID)[0]);
    }, [data.classes])

    const [bucketsList, setBucketsList] = useState([] as JSX.Element[]);
    const [classProps, setClassProps] = useState((<></>) as JSX.Element)

    function setDefaults() {
        setClassProps(
            <>
                <TextField onChange={e => setName(e.target.value)} id="className" variant="outlined" defaultValue={currentClass.name} required label="Class Name" />
                <TextField onChange={e => setCourseNumber(e.target.value)} id="classNumber" variant="outlined" defaultValue={currentClass.number} required label="Class Number" />
            </>
        )
        setBuckets(currentClass.weights)
        setName(currentClass.name)
        setCourseNumber(currentClass.number)
    }

    useEffect(() => {
        setDefaults()
    }, [currentClass.name, currentClass.number])


    const [open, setOpen] = useState(false);
    const [buckets, setBuckets] = useState(currentClass.weights);

    const [name, setName] = useState(currentClass.name)
    const [courseNumber, setCourseNumber] = useState(currentClass.number)


    function close() {
        setDefaults()
        setOpen(false);
    }

    function deleteClass() {
        setData({
            ...data,
            classes: data.classes.filter(x => x.id != props.classID)
        })

        if (selectedClassID === props.classID) {
            setSelectedClassID(null);
        }

        setOpen(false);
    }

    function submit(event: SyntheticEvent) {
        event.preventDefault();
        setData({
            ...data,
            classes: [...data.classes.filter((x) => x.id != currentClass.id), {
                name: name,
                number: courseNumber,
                weights: buckets,
                id: currentClass.id,
                selectedBucket: defaultBucket,
                selectedAssignment: defaultAssignment,
                targetGrade: 90
            }].sort((a, b) => a.name.localeCompare(b.name))
        })

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

    useEffect(() => {
        // handle validation that form adds to 100%
        const submitButton: HTMLObjectElement | null = document.getElementById("add-class-submit-button") as HTMLObjectElement;

        if (buckets.reduce((sum, x) => sum + x.percentage, 0) != 100) {
            submitButton?.setCustomValidity("The sum of all bucket weights must be 100%")
        } else {
            submitButton?.setCustomValidity("")
        }

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
            <Box>
                <Tooltip placement="bottom" title="Edit this class">
                    <IconButton onClick={() => {setOpen(true)}}>
                        <EditRounded fontSize="medium" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Dialog
                open={open}
                onClose={close}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle sx={{fontWeight: "bold", fontSize: "x-large"}}>Edit</DialogTitle>
                <DialogContent>
                    <form onSubmit={submit}>
                        <Stack justifyContent="center" spacing={4} direction={{ xs: 'column', sm: 'row' }} sx={{mt: 6}}>
                            <Stack spacing={2} direction="column">
                                <Typography variant="subtitle1">Class Info</Typography>
                                {
                                    classProps
                                }
                            </Stack>
                            <Stack spacing={2} direction="column">
                                <Typography variant="subtitle1">Weights</Typography>
                                {
                                    bucketsList
                                }
                                <Stack sx={{pt: 2}} justifyContent="space-between" spacing={1} direction="row">
                                    <Button onClick={() => {setBuckets([...buckets, {name: "", percentage: 0, drops:0, assignments: [], id: uuidv4()}])}} sx={{}} size="medium" variant="outlined">Add Bucket</Button>
                                    <Button onClick={() => {setBuckets(buckets.slice(0, -1))}} sx={{}} color="secondary" size="medium" variant="outlined">Remove Bucket</Button>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Divider sx={{my: 4, mx: 2}}></Divider>
                        <Stack justifyContent="center" alignItems="center" direction="row" spacing={2}>
                            <Box textAlign="center">
                                <Button id="add-class-submit-button" type="submit" variant="contained" color="primary" size="large">Save Changes</Button>
                            </Box>
                            <Box textAlign="center">
                                <Button onClick={deleteClass} variant="contained" color="tertiary" size="large">Delete Class</Button>
                            </Box>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
