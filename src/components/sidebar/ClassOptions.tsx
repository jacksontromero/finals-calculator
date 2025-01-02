'use client';

import { BaseSyntheticEvent, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectingStates, useDataStore } from '@/data/store';
import { useRouter } from 'next/navigation';
import ClassForm, { ClassFormData, ClassFormSchema } from './ClassForm';
import { useForm } from 'react-hook-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { SidebarMenuAction } from '../ui/sidebar';

export default function ClassOptions(params: { existingClassId: string }) {
  const { existingClassId } = params;
  const existingClass = useDataStore((state) => state.classes[existingClassId]);
  const [open, setOpen] = useState(false);
  const editClass = useDataStore((state) => state.editClass);

  const form = useForm<ClassFormData>({
    resolver: zodResolver(ClassFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      courseName: existingClass.name,
      courseNumber: existingClass.number,
      buckets: existingClass.weights,
    },
  });

  const router = useRouter();

  const submit = (
    formData: ClassFormData,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) => {
    console.log('formData', formData);
    event?.preventDefault();

    editClass(existingClass.id, {
      id: existingClass.id,
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

    router.push(`/class/${existingClass.id}`);
  };

  const deleteClass = useDataStore((state) => state.deleteClass);

  return (
    <div>
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction>
              <MoreHorizontal />
            </SidebarMenuAction>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem className="hover:cursor-pointer">
              <DialogTrigger>
                <span>Edit Class</span>
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => deleteClass(existingClass.id)}
            >
              <span>Delete Class</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="z-50w-full max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
              Edit Existing Class
            </DialogTitle>
          </DialogHeader>
          <ClassForm form={form} submit={submit} submitText="Save Changes" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
