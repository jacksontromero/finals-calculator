import { Stack } from '@mui/material'
import { useState } from 'react'
import ClassDetails from '../components/ClassDetails'
import Classes from '../components/Classes'
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head'


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

export const defaultAssignment: assignment = {
  name: "",
  score: 0,
  outOf: 100,
  simulated: false,
  id: uuidv4()
}

export const defaultBucket: bucket = {
  name: "",
  percentage: 0,
  drops: 0,
  assignments: [defaultAssignment],
  id: uuidv4()
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
        selectedAssignment: defaultAssignment,
        selectedBucket: defaultBucket,
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
        selectedAssignment: defaultAssignment,
        selectedBucket: defaultBucket,
        targetGrade: 90
      }
    ]
  })

  const [selectedClassID, setSelectedClassID] = useState(null);

  return (
    <div>
      <Head>
        <title>Grade Calculator</title>
        <meta name="Calculate what grade you need in multiple classes with support for different percentage buckets and dropped assignments" content="Meta description for the Home page" />
      </Head>
      <Stack sx={{mt: 2, mx: 2}} direction="column" justifyContent="space-between" spacing={2}>
        {
          selectedClassID != null && <ClassDetails data={data} setData={setData} selectedClassID={selectedClassID}></ClassDetails>
        }

        <Classes data={data} setData={setData} setSelectedClassID={setSelectedClassID}></Classes>
      </Stack>
    </div>
  )
}
