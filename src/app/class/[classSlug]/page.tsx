"use client";

import { getClassStore, useDataStore } from "@/app/store";
import ClassDetails from "@/components/ClassDetails";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ classSlug: string }>;
}) {
  const { classSlug } = use(params);
  const classStore = getClassStore(classSlug);
  const classData = classStore();

  return (
    // <div className="flex flex-col justify-between">
    //   <h1>{classData.name}</h1>
    //   <p>{classData.number}</p>
    // </div>
    <ClassDetails />
  );
}
