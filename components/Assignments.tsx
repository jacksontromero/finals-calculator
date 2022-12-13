import { Add, DeleteOutline } from "@mui/icons-material";
import { Divider, IconButton, TextField } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { schoolClass, bucket, globalData, assignment } from "../pages";
import { v4 as uuidv4 } from 'uuid';

export default function Assignments(props: any) {

    const data: globalData = props.data;
    const setData = props.setData;
    const selected: schoolClass = props.selected;
    const bucket: bucket = props.bucket;

    function addAssignment() {
        setData((prevData: globalData) => {
            prevData.classes.filter(x => x.id === selected.id)[0].weights.filter(x => x.id === bucket.id)[0].assignments.push({
                name: "",
                score: 0,
                id: uuidv4(),
                outOf: 100
            })

            return ({
                ...prevData
            })
        })
    }

    function removeAssignment(id: string) {
        setData((prevData: globalData) => {
            prevData.classes.filter(x => x.id === selected.id)[0].weights.filter(x => x.id === bucket.id)[0].assignments.filter(x => x.id != id);

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

    const [assignmentList, setAssignmentList] = useState<JSX.Element[]>([])

    useEffect(() => {
        setAssignmentList(
            bucket.assignments.map((x) => (
                <Box key={x.id}>
                    <form>
                        <Stack direction="row" spacing={2}>
                            <TextField onChange={e => setAssignmentName(x, e.target.value)} variant="outlined" label="Assignment Name" value={x.name}/>
                            <TextField onChange={e => setAssignmentScore(x, Number(e.target.value))} variant="outlined" type="number" label="Score" value={x.score} InputProps={{
                                inputProps: {
                                    min: 0,
                                }
                            }} />
                            <TextField onChange={e => setAssignmentOutOf(x, Number(e.target.value))} variant="outlined" type="number" label="Out Of" value={x.outOf} InputProps={{
                                inputProps: {
                                    min: 0,
                                }
                            }} />

                            <Box minHeight="full" minWidth="full" alignItems="center" display="flex" textAlign="center">
                                <IconButton tabIndex={-1} onClick={() => {removeAssignment(x.id)}} sx={{borderRadius: 4, height:"40px",width:"40px"}} size="small" color="error">
                                    <DeleteOutline />
                                </IconButton>
                            </Box>

                        </Stack>
                    </form>
                </Box>
            ))
        )
    }, [data, selected])

    return (
        <div>
            <Stack divider={<Divider orientation="horizontal" flexItem />} direction="column" spacing={2}>
                {
                    assignmentList
                }


                <Box minWidth="full" textAlign="center">
                    <IconButton onClick={addAssignment} sx={{borderRadius: 4, height:"40px",width:"40px"}} size="small" color="info">
                        <Add />
                    </IconButton>
                </Box>
            </Stack>

        </div>
    )
}
