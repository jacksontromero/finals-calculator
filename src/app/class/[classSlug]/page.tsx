'use client';

import ClassDetails from '@/app/class/[classSlug]/ClassDetails';
import { useDataStore } from '@/app/store';
import { use } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ classSlug: string }>;
}) {
  const { classSlug } = use(params);
  const classExists = useDataStore((state) =>
    state.classes.hasOwnProperty(classSlug)
  );

  return classExists ? (
    <ClassDetails classId={classSlug} />
  ) : (
    <div>Loading...</div>
  );
}
