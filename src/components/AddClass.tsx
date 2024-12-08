"use client";

import { JSX, SyntheticEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  bucket,
  defaultAssignment,
  defaultBucket,
  globalData,
  schoolClass,
} from './Data';
import { Card, CardContent } from './ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Muted } from './ui/typography';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { useForm } from 'react-hook-form';

export default function AddClass(props: any) {
  const data: globalData = props.data;
  const setData = props.setData;
  const setSelectedClassID = props.setSelectedClassID;

  const [open, setOpen] = useState(false);
  const [buckets, setBuckets] = useState([] as bucket[]);

  const [name, setName] = useState('');
  const [courseNumber, setCourseNumber] = useState('');

  useEffect(() => {
    setOpen(
      localStorage.getItem('data') === null ||
      JSON.parse(localStorage.getItem('data') as string).classes.length === 0
    );
  }, []);

  function submit(event: SyntheticEvent) {
    event.preventDefault();

    const newID = uuidv4();

    if (data.classes.length === 0) {
      setSelectedClassID(newID);
    }

    setData({
      ...data,
      classes: [
        ...data.classes,
        ...[
          {
            name: name,
            number: courseNumber,
            weights: buckets,
            id: newID,
            selectedBucket: defaultBucket,
            selectedAssignment: defaultAssignment,
            targetGrade: 90,
          } as schoolClass,
        ],
      ].sort((a, b) => a.name.localeCompare(b.name)),
    });

    setBuckets([]);
    setName('');
    setCourseNumber('');

    setOpen(false);
  }

  function updateBucketName(b: bucket, newName: string) {
    setBuckets(
      buckets.map((x) => {
        if (x.id === b.id) {
          return {
            ...x,
            name: newName,
          };
        } else {
          return x;
        }
      })
    );
  }

  function updateBucketWeight(b: bucket, newWeight: number) {
    setBuckets(
      buckets.map((x) => {
        if (x.id === b.id) {
          return {
            ...x,
            percentage: newWeight,
          };
        } else {
          return x;
        }
      })
    );
  }

  function updateBucketDrops(b: bucket, newDrops: number) {
    setBuckets(
      buckets.map((x) => {
        if (x.id === b.id) {
          return {
            ...x,
            drops: newDrops,
          };
        } else {
          return x;
        }
      })
    );
  }

  const [bucketsList, setBucketsList] = useState([] as JSX.Element[]);

  const form = useForm();

  useEffect(() => {
    // handle validation that <f>orm adds to 100%
    const submitButton: HTMLObjectElement | null = document.getElementById(
      'add-class-submit-button'
    ) as HTMLObjectElement;

    if (buckets.reduce((sum, x) => sum + x.percentage, 0) != 100) {
      submitButton?.setCustomValidity(
        'The sum of all bucket weights must be 100%'
      );
    } else {
      submitButton?.setCustomValidity('');
    }

    setBucketsList(
      buckets.map((x) => (
        <div key={x.id}>
          <Card>
            <CardContent className="flex flex-row gap-1">
              <FormField control={form.control} name={`buckets.${x.id}.name`} render={({ field }) => (
                <FormItem>
                  <FormControl className="w-1/2">
                    <Input
                      onChangeCapture={(e) => updateBucketName(x, e.currentTarget.value)}
                      required
                      defaultValue={x.name}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="ml-1">Bucket Name</FormDescription>
                </FormItem>
              )} />
              <FormField control={form.control} name={`buckets.${x.id}.percentage`} render={({ field }) => (
                <FormItem>
                  <FormControl className="w-1/3">
                    <Input
                      onChangeCapture={(e) =>
                        updateBucketWeight(x, Number(e.currentTarget.value))
                      }
                      required
                      defaultValue={x.percentage}
                      type="number"
                      min={0}
                      max={100}
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="ml-1">Percentage</FormDescription>
                </FormItem>

              )} />
              <FormField control={form.control} name={`buckets.${x.id}.drops`} render={({ field }) => (
                <FormItem>
                  <FormControl className="w-1/5">
                    <Input
                      onChangeCapture={(e) => updateBucketDrops(x, Number(e.currentTarget.value))}
                      required
                      defaultValue={x.drops}
                      type="number"
                      min={0}
                      onWheel={(e) => (e.target as HTMLElement).blur()}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="ml-1">Drops</FormDescription>
                </FormItem>
              )} />
            </CardContent>
          </Card>
        </div>
      ))
    );
  }, [buckets]);

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
              Add a New Class
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submit}>
            <div className="flex mt-6 flex-col gap-4 justify-center">
              <div className="flex flex-col gap-2">
                <Muted>Class Info</Muted>
                <FormLabel>Class Name</FormLabel>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  defaultValue={name}
                  id="className"
                  required
                />
                <FormLabel>Class Number</FormLabel>
                <Input
                  onChange={(e) => setCourseNumber(e.target.value)}
                  defaultValue={courseNumber}
                  id="classNumber"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Muted>Weights</Muted>
                <Form {...form}>
                  <form>
                    {bucketsList}
                  </form>
                </Form>
                <div className="flex justify-between gap-1 pt-2">
                  <Button
                    onClick={() => {
                      setBuckets([
                        ...buckets,
                        {
                          name: '',
                          percentage: 0,
                          drops: 0,
                          assignments: [],
                          id: uuidv4(),
                        },
                      ]);
                    }}
                    variant="outline"
                  >
                    Add Bucket
                  </Button>
                  <Button
                    onClick={() => {
                      setBuckets(buckets.slice(0, -1));
                    }}
                    variant="outline"
                    color="secondary"
                  >
                    Remove Bucket
                  </Button>
                </div>
              </div>
            </div>
            <Separator className="mx-2 my-4"></Separator>
            <Card className="text-center">
              <Button
                id="add-class-submit-button"
                type="submit"
                variant="default"
              >
                Add Class
              </Button>
            </Card>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
