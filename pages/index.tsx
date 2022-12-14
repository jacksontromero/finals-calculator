import { Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import ClassDetails from '../components/ClassDetails'
import Classes from '../components/Classes'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { v4 as uuidv4 } from 'uuid';

export type assignment = {
  name: string,
  score: number
  outOf: number,
  id: string,
  simulated: boolean,
}

export type bucket = {
  name: string,
  percentage: number,
  drops: number,
  assignments: assignment[]
  id: string,
}

export type schoolClass = {
  name: string,
  number: string,
  weights: bucket[],
  id: string,
  selectedBucket: bucket | null,
  selectedAssignment: assignment | null,
  targetGrade: number,
}

export type globalData = {
  classes: schoolClass[]
}

export default function Home() {
  const [data, setData] = useState<globalData>({
    classes: [
      {
        name: "Probability",
        number: "36-218",
        id: uuidv4(),
        weights: [
          {
            name: "Homework",
            percentage: 35,
            drops: 2,
            id: uuidv4(),
            assignments: []
          },
          {
            name: "Participation",
            percentage: 5,
            drops: 0,
            id: uuidv4(),
            assignments: []
          },
          {
            name: "Quizzes",
            percentage: 15,
            drops: 0,
            id: uuidv4(),
            assignments: []
          },
          {
            name: "Midterm",
            percentage: 20,
            drops: 0,
            id: uuidv4(),
            assignments: []
          },
          {
            name: "Final",
            percentage: 25,
            drops: 0,
            id: uuidv4(),
            assignments: []
          },
        ],
        selectedAssignment: null,
        selectedBucket: null,
        targetGrade: 90
      },
      {
        name: "Software",
        number: "17-214",
        id: uuidv4(),
        weights: [
          {
            name: "Homework",
            percentage: 50,
            drops: 2,
            id: uuidv4(),
            assignments: []
          },
          {
            name: "Midterm 1",
            percentage: 10,
            drops: 0,
            id: uuidv4(),
            assignments: []
          },
          {
            name: "Midterm 2",
            percentage: 10,
            drops: 0,
            id: uuidv4(),
            assignments: []
          },
          {
            name: "Quizzes",
            percentage: 5,
            drops: 4,
            id: uuidv4(),
            assignments: []
          },
          {
            name: "Participation",
            percentage: 5,
            drops: 0,
            id: uuidv4(),
            assignments: []
          },
          {
            name: "Final",
            percentage: 20,
            drops: 0,
            id: uuidv4(),
            assignments: []
          },
        ],
        selectedAssignment: null,
        selectedBucket: null,
        targetGrade: 90
      }
    ]
  })

  const [selected, setSelected] = useState(null);

  const {height, width} = useWindowDimensions();

  return (
      <Stack sx={{mt: 4, mx: 4, minHeight: (height == 0 ? 1080*.75 : height * .75)}} direction="column" justifyContent="space-between" spacing={2}>
        {
          selected != null && <ClassDetails data={data} setData={setData} selected={selected}></ClassDetails>
        }

        <Classes data={data} setData={setData} setSelected={setSelected}></Classes>
      </Stack>
  )
}
