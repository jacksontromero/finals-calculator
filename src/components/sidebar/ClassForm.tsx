'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { SubmitHandler, useFieldArray, UseFormReturn } from 'react-hook-form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Trash2Icon } from 'lucide-react';
import { z } from 'zod';
import { bucket, defaultBucket } from '@/data/store';

export const ClassFormSchema = z.object({
  courseName: z.string().min(1),
  courseNumber: z.string().min(1),
  buckets: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        percentage: z.coerce.number().min(0).max(100),
        drops: z.number().min(0),
        assignments: z.array(
          z.object({
            id: z.string().min(1),
            name: z.string().min(0),
            score: z.coerce.number().min(0).max(100),
            outOf: z.number().min(0),
            simulated: z.boolean(),
          })
        ),
      }) satisfies z.ZodType<bucket>
    )
    .refine(
      (buckets) =>
        buckets.reduce((sum, x) => sum + Number(x.percentage), 0) === 100,
      {
        message: 'The sum of all bucket weights must be 100%',
        path: ['refine'],
      }
    ),
});

export type ClassFormData = z.infer<typeof ClassFormSchema>;

export default function ClassForm(params: {
  form: UseFormReturn<
    {
      courseName: string;
      courseNumber: string;
      buckets: bucket[];
    },
    any,
    undefined
  >;
  submit: SubmitHandler<ClassFormData>;
  submitText: string;
}) {
  const { form, submit, submitText } = params;

  const bucketsSum = form
    .watch('buckets')
    .reduce((sum, x) => sum + Number(x.percentage), 0);

  const { fields, append, remove } = useFieldArray({
    name: 'buckets',
    control: form.control,
  });
  return (
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
                        name={`buckets.${index}.name`}
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
                        name={`buckets.${index}.percentage`}
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
                        name={`buckets.${index}.drops`}
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          className="-mt-7"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <Trash2Icon className="text-destructive" size={20} />
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
                  append(defaultBucket());
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
            <p role="alert" className="text-destructive text-sm font-bold">
              The sum of all bucket weights must be 100%
            </p>
          )}
          <Button
            className="max-w-md"
            type="submit"
            disabled={bucketsSum != 100}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
