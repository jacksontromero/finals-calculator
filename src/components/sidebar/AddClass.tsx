'use client';

import { BaseSyntheticEvent, useState } from 'react';
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
import { defaultBucket, SelectingStates, useDataStore } from '@/app/store';
import { useRouter } from 'next/navigation';
import ClassForm, { ClassFormData, ClassFormSchema } from './ClassForm';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function AddClass() {
  const [open, setOpen] = useState(false);
  const addClass = useDataStore((state) => state.addClass);

  // TODO - come back, add auto-open if no classes

  // const classes = useDataStore((state) => state.classes);

  // useEffect(() => {
  //   setOpen(classes.length === 0);
  // }, [classes]);

  const form = useForm<ClassFormData>({
    resolver: async (data, context, options) => {
      // console.log('formData', data);
      // console.log(
      //   'validation result',
      //   await zodResolver(ClassFormSchema)(data, context, options)
      // );

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
    <div>
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
