"use client";

import { useEffect, useState } from "react";
import { assignment, bucket, schoolClass, useDataStore } from "@/app/store";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { P } from "./ui/typography";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

export default function Assignments(params: {
  classData: schoolClass;
  bucket: bucket;
}) {
  const classData = params.classData;
  const classId = classData.id;
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

  function selectAssignment(a: assignment) {
    if (classData.selectedAssignment != null) {
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
          // sx={{
          //   py: 1,
          //   borderRadius: 2,
          //   backgroundColor:
          //     selected.selectedAssignment != null &&
          //     selected.selectedAssignment.id === x.id
          //       ? alpha(theme.palette.primary.main, 0.2)
          //       : "",
          // }}
          className={`py-1 rounded-md border bg-background ${
            classData.selectedAssignment != null &&
            classData.selectedAssignment.id === x.id
              ? "bg-primary/20"
              : ""
          }`}
        >
          {classData.selectedAssignment != null ? (
            <form>
              <div className="flex flex-row gap-1 items-center">
                <Input
                  className="w-[40%]"
                  onChange={(e) =>
                    setAssignmentName(classId, bucket.id, x, e.target.value)
                  }
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
                  min={0}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  onWheel={(e) => (e.target as HTMLElement).blur()}
                />

                <div className="w-20 flex flex-col items-center justify-center gap-0">
                  <div className="min-h-full min-w-full align-items-center flex text-center">
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
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Checkbox
                          tabIndex={-1}
                          // className="h-30 w-10"
                          checked={x.simulated}
                          onChange={() =>
                            simulateAssignment(classId, bucket.id, x)
                          }
                        />
                      </TooltipTrigger>
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
              {x.name == "" ? "Unnamed" : x.name}
            </Button>
          )}
        </div>
      ))
    );
  }, [classData, bucket]);

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
      {/* <Box textAlign="center">
        <Tooltip title="Add Assignment">
          <IconButton
            onClick={addAssignment}
            sx={{ borderRadius: 4, height: "40px", width: "40px" }}
            size="small"
            color="primary"
          >
            <Add />
          </IconButton>
        </Tooltip>
      </Box> */}
    </div>
  );
}
