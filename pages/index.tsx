import { useState } from 'react'
import Classes from '../components/Classes'

export default function Home() {
  const [data, setData] = useState({
    classes: [
      {
        name: "Probability",
        number: "36-218"
      },
      {
        name: "Software",
        number: "17-218"
      },
      {
        name: "Systems",
        number: "15-213"
      },

    ]
  })

  return (
    <Classes data={data} setData={setData}></Classes>
  )
}
