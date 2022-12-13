import { Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import ClassDetails from '../components/ClassDetails'
import Classes from '../components/Classes'
import useWindowDimensions from '../hooks/useWindowDimensions'

export type assignment = {
  name: string,
  score: number
  outOf: number,
}

export type bucket = {
  name: string,
  percentage: number,
  drops: number,
  assignments: assignment[]
}

export type schoolClass = {
  name: string,
  number: string,
  weights: bucket[]
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
        weights: [
          {
            name: "Homework",
            percentage: 35,
            drops: 2,
            assignments: []
          },
          {
            name: "Participation",
            percentage: 5,
            drops: 0,
            assignments: []
          },
          {
            name: "Quizzes",
            percentage: 15,
            drops: 0,
            assignments: []
          },
          {
            name: "Midterm",
            percentage: 20,
            drops: 0,
            assignments: []
          },
          {
            name: "Final",
            percentage: 25,
            drops: 0,
            assignments: []
          },
        ]
      },
      {
        name: "Software",
        number: "17-214",
        weights: [
          {
            name: "Homework",
            percentage: 50,
            drops: 2,
            assignments: []
          },
          {
            name: "Midterm 1",
            percentage: 10,
            drops: 0,
            assignments: []
          },
          {
            name: "Midterm 2",
            percentage: 10,
            drops: 0,
            assignments: []
          },
          {
            name: "Quizzes",
            percentage: 5,
            drops: 4,
            assignments: []
          },
          {
            name: "Participation",
            percentage: 5,
            drops: 0,
            assignments: []
          },
          {
            name: "Final",
            percentage: 20,
            drops: 0,
            assignments: []
          },
        ]
      }
    ]
  })

  const [selected, setSelected] = useState(data.classes[0]);

  const {height, width} = useWindowDimensions();

  return (
      <Stack sx={{mt: 4, mx: 4, minHeight: (height == 0 ? 1080*.75 : height * .75)}} direction="column" justifyContent="space-between" spacing={2}>
        <ClassDetails data={data} setData={setData} selected={selected}></ClassDetails>
        <Classes data={data} setData={setData} setSelected={setSelected}></Classes>
      </Stack>
  )
}
