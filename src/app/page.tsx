"use client";

import ClassDetails from "@/components/ClassDetails";
import Classes from "@/components/Classes";
import { defaultAssignment, defaultBucket, globalData } from "@/components/Data";
import { Card, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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

  // const [data, setData] = useState<globalData>({classes: []})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem("data");
    setLoaded(true);
    if (data) {
      setData(JSON.parse(data));
    }
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("data", JSON.stringify(data));
    }
  }, [data])

  const [selectedClassID, setSelectedClassID] = useState(null);

  return (
    //  <Box sx={{minHeight: "100%"}}>
    //   <Head>
    //     <title>Final Grade Calculator</title>
    //     <meta name="description" content="Calculator for what grade you need on an assignment to get a specific grade in a class.  Supports multiple classes, grading schemes that make use of buckets/weights for different types of assignments, dropping/drops for the lowest assignments per bucket, and simulating average performance on assignments." />
    //   </Head>
    //   <Box sx={{minHeight: "100%"}}>
    //     <Stack sx={{mt: 2, mx: 2}} direction="column" justifyContent="space-between" spacing={2}>
    //       {
    //         selectedClassID != null && <ClassDetails data={data} setData={setData} selectedClassID={selectedClassID}></ClassDetails>
    //       }

    //       <Classes data={data} setData={setData} selectedClassID={selectedClassID} setSelectedClassID={setSelectedClassID}></Classes>
    //     </Stack>
    //   </Box>
    //   <Footer></Footer>
    // </Box>
    // <h1>Hi</h1>
    <div className="flex flex-col justify-between">
      {/* {
        selectedClassID != null && <ClassDetails data={data} setData={setData} selectedClassID={selectedClassID}></ClassDetails>
      } */}

      <Classes className="m-4" data={data} setData={setData} selectedClassID={selectedClassID} setSelectedClassID={setSelectedClassID}></Classes>
    </div>
  );
}
