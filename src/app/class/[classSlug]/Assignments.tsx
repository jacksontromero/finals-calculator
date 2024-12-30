'use client';

import { useEffect, useState } from 'react';
import { assignment, bucket, schoolClass, useDataStore } from '@/app/store';
import { Input } from '../../../components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { P } from '../../../components/ui/typography';
import { Checkbox } from '../../../components/ui/checkbox';
import { Button } from '../../../components/ui/button';

export default function Assignments(params: {
  classId: string;
  bucket: bucket;
}) {
  const classId = params.classId;
  const bucket = params.bucket;

  const removeSelectedAssignment = useDataStore(
    (state) => state.removeSelectedAssignment
  );
  const pickSelectedAssignment = useDataStore(
    (state) => state.pickSelectedAssignment
  );
  const setAssignmentName = useDataStore((state) => state.setAssignmentName);
  const setAssignmentScore = useDataStore((state) => state.setAssignmentScore);
  const setAssignmentOutOf = useDataStore((state) => state.setAssignmentOutOf);
  const simulateAssignment = useDataStore((state) => state.simulateAssignment);
  const removeAssignment = useDataStore((state) => state.removeAssignment);
  const addNewAssignment = useDataStore((state) => state.addNewAssignment);

  const selectedAssignment = useDataStore(
    (state) => state.classes[classId].selectedAssignment
  );

  function selectAssignment(a: assignment) {
    if (selectedAssignment != null) {
      removeSelectedAssignment(classId);
    } else {
      pickSelectedAssignment(classId, a, bucket);
    }
  }

  const [assignmentList, setAssignmentList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setAssignmentList(
      bucket.assignments.map((x) => (
        <div
          key={x.id}
          className={`py-1 bg-background ${
            selectedAssignment != null && selectedAssignment.id === x.id
              ? 'bg-primary/20'
              : ''
          }`}
        >
          {selectedAssignment != null ? (
            <form>
              <div className="flex flex-row gap-1 items-center">
                <Input
                  className="w-[40%]"
                  onChange={(e) =>
                    setAssignmentName(classId, bucket.id, x, e.target.value)
                  }
                  placeholder="Assignment Name"
                  defaultValue={x.name}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                />
                <Input
                  className="w-[30%]"
                  disabled={x.simulated}
                  onChange={(e) =>
                    setAssignmentScore(
                      classId,
                      bucket.id,
                      x,
                      Number(e.target.value)
                    )
                  }
                  type="number"
                  defaultValue={x.score}
                  placeholder="Score"
                  min={0}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                />
                <Input
                  className="w-[30%]"
                  onChange={(e) =>
                    setAssignmentOutOf(
                      classId,
                      bucket.id,
                      x,
                      Number(e.target.value)
                    )
                  }
                  type="number"
                  defaultValue={x.outOf}
                  placeholder="Out Of"
                  min={0}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                />

                <div className="w-8 flex flex-col items-center justify-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() =>
                          removeAssignment(classId, bucket.id, x.id)
                        }
                      >
                        <Trash2Icon size={20} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <P>Delete Assignment</P>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Checkbox
                          tabIndex={-1}
                          // className="h-30 w-10"
                          checked={x.simulated}
                          onCheckedChange={() =>
                            simulateAssignment(classId, bucket.id, x)
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <P>
                          Simulate score using average without drops of other
                          assignments
                        </P>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </form>
          ) : (
            <Button
              variant="outline"
              size="default"
              onClick={() => selectAssignment(x)}
            >
              {x.name == '' ? 'Unnamed' : x.name}
            </Button>
          )}
        </div>
      ))
    );
  }, [bucket]);

  return (
    <div className="flex flex-col gap-0 items-center">
      {assignmentList}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={() => addNewAssignment(classId, bucket.id)}>
            <PlusIcon />
          </TooltipTrigger>
          <TooltipContent>
            <P>Add Assignment</P>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
