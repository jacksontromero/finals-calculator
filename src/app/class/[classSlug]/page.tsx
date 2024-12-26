"use client";

import ClassDetails from "@/components/ClassDetails";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ classSlug: string }>;
}) {
  const { classSlug } = use(params);

  return <ClassDetails classId={classSlug} />;
}
