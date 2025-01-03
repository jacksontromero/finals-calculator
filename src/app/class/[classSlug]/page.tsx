'use client';

import ClassDetails from '@/app/class/[classSlug]/ClassDetails';
import { useDataStore } from '@/data/store';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ classSlug: string }>;
}) {
  const { classSlug } = use(params);
  const classExists = useDataStore((state) =>
    state.classes.hasOwnProperty(classSlug)
  );

  const hasHydrated = useDataStore((state) => state._hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !classExists) {
      router.push('/');
    }
  }, [hasHydrated, classExists, router]);

  return classExists ? <ClassDetails classId={classSlug} /> : <div></div>;
}
