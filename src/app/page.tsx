"use client";

import ClassDetails from "@/components/ClassDetails";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  defaultAssignment,
  defaultBucket,
  probExampleClass,
  schoolClass,
  softwareExampleClass,
  useDataStore,
} from "./store";

export default function Home() {
  // const loadAllData = useDataStore((state) => state.loadAllData);
  // const cachedData = useDataStore((state) => ({
  //   classes: state.classes,
  //   selectedClassId: state.selectedClassId,
  // }));

  // const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   const data = localStorage.getItem("data");
  //   setLoaded(true);
  //   if (data) {
  //     loadAllData(JSON.parse(data));
  //   }
  // }, []);

  // useEffect(() => {
  //   if (loaded) {
  //     localStorage.setItem("data", JSON.stringify(cachedData));
  //   }
  // }, [cachedData]);

  // const selectedClassId = useDataStore((state) => state.selectedClassId);

  const numClasses = useDataStore((state) => state.classes.size);
  const addClass = useDataStore((state) => state.addClass);

  if (numClasses === 0) {
    addClass(probExampleClass);
    addClass(softwareExampleClass);
  }

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
    // <div className="flex flex-col justify-between">
    //   {selectedClassId != null && <ClassDetails />}
    // </div>
    <></>
  );
}
