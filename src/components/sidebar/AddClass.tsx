'use client';

import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultBucket, SelectingStates, useDataStore } from '@/data/store';
import { useRouter } from 'next/navigation';
import ClassForm, { ClassFormData, ClassFormSchema } from './ClassForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

export default function AddClass() {
  const numClasses = useDataStore(
    useShallow((state) => Object.keys(state.classes).length)
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(numClasses === 0);
  }, [numClasses]);

  const addClass = useDataStore((state) => state.addClass);

  const form = useForm<ClassFormData>({
    resolver: async (data, context, options) => {
      return zodResolver(ClassFormSchema)(data, context, options);
    },
    mode: 'onSubmit',
    defaultValues: {
      courseName: '',
      courseNumber: '',
      buckets: [defaultBucket()],
    },
  });

  const router = useRouter();

  const submit: SubmitHandler<ClassFormData> = (
    formData: ClassFormData,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) => {
    event?.preventDefault();

    const newID = uuidv4();

    addClass({
      id: newID,
      name: formData.courseName,
      number: formData.courseNumber,
      weights: formData.buckets,
      selectingState: SelectingStates.FIRST_LOAD,
      selectedBucket: null,
      selectedAssignment: null,
      targetGrade: 90,
    });

    form.reset();
    setOpen(false);

    router.push(`/class/${newID}`);
  };

  return (
    <div className="flex  justify-center">
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setOpen(true);
            }}
            className="my-2"
          >
            Add New Class
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
              Add a New Class
            </DialogTitle>
          </DialogHeader>
          <ClassForm form={form} submit={submit} submitText="Add Class" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
