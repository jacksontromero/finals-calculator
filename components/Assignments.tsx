import { Add, DeleteOutline } from "@mui/icons-material";
import { Divider, IconButton, TextField, Checkbox, Tooltip, Button, useMediaQuery, useTheme } from "@mui/material";
import { alpha, Box, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { schoolClass, bucket, globalData, assignment } from "../pages";
import { v4 as uuidv4 } from 'uuid';

export default function Assignments(props: any) {

    const data: globalData = props.data;
    const setData = props.setData;
    const selected: schoolClass = props.selected;
    const bucket: bucket = props.bucket;

    const removeSelectedAssignment = props.removeSelectedAssignment;
    const pickSelectedAssignment = props.pickSelectedAssignment;

    function addAssignment() {
        setData((prevData: globalData) => {
            prevData.classes.filter(x => x.id === selected.id)[0].weights.filter(x => x.id === bucket.id)[0].assignments.push({
                name: "",
                score: 0,
                id: uuidv4(),
                outOf: 100,
                simulated: false
            })

            return ({
                ...prevData
            })
        })
    }

    function removeAssignment(id: string) {
        setData((prevData: globalData) => {
            let assignments = prevData.classes.filter(x => x.id === selected.id)[0].weights.filter(x => x.id === bucket.id)[0].assignments
            assignments.splice(assignments.findIndex(x => x.id === id), 1);

            return ({
                ...prevData
            })
        })
    }

    function setAssignmentName(a: assignment, newName: string) {
        setData((prevData: globalData) => {
            prevData.classes.filter(x => x.id === selected.id)[0].weights.filter(x => x.id === bucket.id)[0].assignments.filter(x => x.id === a.id)[0].name = newName;

            return ({
                ...prevData
            })
        })
    }

    function setAssignmentScore(a: assignment, newScore: number) {
        setData((prevData: globalData) => {
            prevData.classes.filter(x => x.id === selected.id)[0].weights.filter(x => x.id === bucket.id)[0].assignments.filter(x => x.id === a.id)[0].score = newScore;

            return ({
                ...prevData
            })
        })
    }

    function setAssignmentOutOf(a: assignment, newOutOf: number) {
        setData((prevData: globalData) => {
            prevData.classes.filter(x => x.id === selected.id)[0].weights.filter(x => x.id === bucket.id)[0].assignments.filter(x => x.id === a.id)[0].outOf = newOutOf;

            return ({
                ...prevData
            })
        })
    }

    function simulateAssignment(a: assignment) {
        setData((prevData: globalData) => {
            prevData.classes.filter(x => x.id === selected.id)[0].weights.filter(x => x.id === bucket.id)[0].assignments.filter(x => x.id === a.id)[0].simulated = !a.simulated;

            return ({
                ...prevData
            })
        })
    }

    function selectAssignment(a: assignment) {

        if (selected.selectedAssignment != null) {
            removeSelectedAssignment();
        } else {
            pickSelectedAssignment(a, bucket);
        }
    }

    const [assignmentList, setAssignmentList] = useState<JSX.Element[]>([])

    const theme = useTheme();

    useEffect(() => {
        setAssignmentList(
            bucket.assignments.map((x) => (
                <Box key={x.id} sx={{p: 1, borderRadius: 2, backgroundColor: (selected.selectedAssignment != null && selected.selectedAssignment.id === x.id) ?  alpha(theme.palette.primary.main, .2) : ""}}>

                    {

                        (selected.selectedAssignment != null) ? (
                            <form>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <TextField sx={{width: "40%"}} onChange={e => setAssignmentName(x, e.target.value)} variant="outlined" label="Name" defaultValue={x.name} onFocus={
                                        (e) => {
                                            e.target.select();
                                        }
                                    }
                                />
                                    <TextField sx={{width: "30%"}} disabled={x.simulated} onChange={e => setAssignmentScore(x, Number(e.target.value))} variant="outlined" type="number" label="Score" defaultValue={x.score} InputProps={{
                                        inputProps: {
                                            min: 0,
                                        }
                                    }} onFocus={
                                        (e) => {
                                            e.target.select();
                                        }
                                    }/>
                                    <TextField sx={{width: "30%"}} onChange={e => setAssignmentOutOf(x, Number(e.target.value))} variant="outlined" type="number" label="Out Of" defaultValue={x.outOf} InputProps={{
                                        inputProps: {
                                            min: 0,
                                        }
                                    }} onFocus={
                                        (e) => {
                                            e.target.select();
                                        }
                                    }/>

                                    <Stack direction="column" alignItems="center" justifyContent="center"  spacing={0}>
                                        <Box minHeight="full" minWidth="full" alignItems="center" display="flex" textAlign="center">
                                            <Tooltip title="Delete Assignment" placement="top">
                                                <IconButton tabIndex={-1} onClick={() => {removeAssignment(x.id)}} sx={{borderRadius: 4, height:"30px",width:"30px"}} size="small" color="error">
                                                    <DeleteOutline />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Tooltip title="Replace score with 'Average without drops'" placement="bottom">
                                            <Checkbox  tabIndex={-1} size="small" color="primary"  checked={x.simulated} onChange={() => simulateAssignment(x)}/>
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                            </form>
                        ) : (
                            <Button variant="outlined" size="medium" onClick={() => selectAssignment(x)}>
                                {x.name == "" ? "Unnamed" : x.name}
                            </Button>
                        )
                    }
                </Box>
            ))
        )
    }, [data, selected, bucket, selected.selectedAssignment])

    return (
        <Stack direction="column" spacing={0}
            alignItems={"center"}
        >
            {
                assignmentList
            }

            <Box textAlign="center">
                <Tooltip title="Add Assignment">
                    <IconButton onClick={addAssignment} sx={{borderRadius: 4, height:"40px",width:"40px"}} size="small" color="primary">
                        <Add />
                    </IconButton>
                </Tooltip>
            </Box>
        </Stack>
    )
}
