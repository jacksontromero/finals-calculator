import { useState } from 'react'
import Classes from '../components/Classes'

export type schoolClass = {
  name: string,
  number: string,
  weights: {
    name: string,
    percentage: number,
    drops: number
  }[]
}

export default function Home() {
  const [data, setData] = useState<{classes: schoolClass[]}>({
    classes: [
      {
        name: "Probability",
        number: "36-218",
        weights: [
          {
            name: "Homework",
            percentage: 35,
            drops: 2,
          },
          {
            name: "Participation",
            percentage: 5,
            drops: 0,
          },
          {
            name: "Quizzes",
            percentage: 15,
            drops: 0,
          },
          {
            name: "Midterm",
            percentage: 20,
            drops: 0,
          },
          {
            name: "Final",
            percentage: 25,
            drops: 0,
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
          },
          {
            name: "Midterm 1",
            percentage: 10,
            drops: 0,
          },
          {
            name: "Midterm 2",
            percentage: 10,
            drops: 0,
          },
          {
            name: "Quizzes",
            percentage: 5,
            drops: 4,
          },
          {
            name: "Participation",
            percentage: 5,
            drops: 0,
          },
          {
            name: "Final",
            percentage: 20,
            drops: 0,
          },
        ]
      }
    ]
  })

  return (
    <Classes data={data} setData={setData}></Classes>
  )
}
