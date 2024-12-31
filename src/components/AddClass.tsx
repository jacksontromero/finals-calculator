'use client';

import { BaseSyntheticEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { z } from 'zod';
import { Separator } from './ui/separator';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { defaultAssignment, SelectingStates, useDataStore } from '@/app/store';
import { Trash2Icon } from 'lucide-react';

const FormSchema = z.object({
  courseName: z.string().min(1),
  courseNumber: z.string().min(1),
  buckets: z
    .array(
      z.object({
        bucketName: z.string().min(1),
        bucketPercentage: z.coerce.number().min(0).max(100),
        bucketDrops: z.number().min(0),
      })
    )
    .refine(
      (buckets) =>
        buckets.reduce((sum, x) => sum + Number(x.bucketPercentage), 0) === 100,
      {
        message: 'The sum of all bucket weights must be 100%',
        path: ['refine'],
      }
    ),
});

type FormData = z.infer<typeof FormSchema>;

export default function AddClass(props: any) {
  const [open, setOpen] = useState(false);
  const addClass = useDataStore((state) => state.addClass);

  // TODO - come back, add auto-open if no classes

  // const classes = useDataStore((state) => state.classes);

  // useEffect(() => {
  //   setOpen(classes.length === 0);
  // }, [classes]);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues: {
      courseName: '',
      courseNumber: '',
      buckets: [
        {
          bucketName: '',
          bucketPercentage: 0,
          bucketDrops: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'buckets',
    control: form.control,
  });

  function submit(
    formData: FormData,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) {
    event?.preventDefault();

    const newID = uuidv4();

    addClass({
      id: newID,
      name: formData.courseName,
      number: formData.courseNumber,
      weights: formData.buckets.map((x) => ({
        name: x.bucketName,
        percentage: x.bucketPercentage,
        drops: x.bucketDrops,
        assignments: [defaultAssignment()],
        id: uuidv4(),
      })),
      selectingState: SelectingStates.FIRST_LOAD,
      selectedBucket: null,
      selectedAssignment: null,
      targetGrade: 90,
    });

    form.reset();
    setOpen(false);
  }

  const bucketsSum = form
    .watch('buckets')
    .reduce((sum, x) => sum + Number(x.bucketPercentage), 0);

  return (
    <div>
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setOpen(true);
            }}
            variant="outline"
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
              <div className="flex mt-6 flex-row gap-8">
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="courseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name</FormLabel>
                        <FormControl>
                          <Input
                            required
                            placeholder="Imperative Computation"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="courseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Number</FormLabel>
                        <FormControl>
                          <Input required placeholder="15-122" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FormLabel>Weights</FormLabel>
                  {fields.map((field, index) => {
                    return (
                      <div key={field.id}>
                        <div className="flex flex-row gap-1">
                          <div className="w-1/2">
                            <FormField
                              control={form.control}
                              name={`buckets.${index}.bucketName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      required
                                      placeholder="Homework"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription className="ml-1">
                                    Bucket Name
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="w-1/4">
                            <FormField
                              control={form.control}
                              name={`buckets.${index}.bucketPercentage`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      required
                                      type="number"
                                      min={0}
                                      max={100}
                                      onWheel={(e) =>
                                        (e.target as HTMLElement).blur()
                                      }
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription className="ml-1">
                                    Percentage
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="w-1/4">
                            <FormField
                              control={form.control}
                              name={`buckets.${index}.bucketDrops`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      required
                                      type="number"
                                      min={0}
                                      onWheel={(e) =>
                                        (e.target as HTMLElement).blur()
                                      }
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription className="ml-1">
                                    Drops
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>
                          {/* trash bin icon to delete bucket */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger
                                className="-mt-7"
                                onClick={() => remove(index)}
                              >
                                <Trash2Icon size={20} />
                              </TooltipTrigger>
                              <TooltipContent className="-mb-5">
                                <p>Delete this bucket</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between gap-1 pt-2">
                    <Button
                      onClick={() => {
                        append({
                          bucketName: '',
                          bucketPercentage: 0,
                          bucketDrops: 0,
                        });
                      }}
                      type="button"
                      variant="outline"
                    >
                      Add Bucket
                    </Button>
                  </div>
                </div>
              </div>
              <Separator className="mx-2 my-4"></Separator>
              <div className="text-center flex flex-col gap-2 items-center">
                {bucketsSum != 100 && (
                  <p role="alert" className="text-red-500 text-sm font-bold">
                    The sum of all bucket weights must be 100%
                  </p>
                )}
                <Button
                  className="max-w-md"
                  id="add-class-submit-button"
                  type="submit"
                  variant="default"
                  disabled={bucketsSum != 100}
                >
                  Add Class
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
