import { StoreApi, UseBoundStore, create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { persist, createJSONStorage, StorageValue } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type assignment = {
  name: string;
  score: number;
  outOf: number;
  id: string;
  simulated: boolean;
};

export type bucket = {
  name: string;
  percentage: number;
  drops: number;
  assignments: assignment[];
  id: string;
};

export type schoolClass = {
  name: string;
  number: string;
  weights: bucket[];
  id: string;
  selectedBucket: bucket | null;
  selectedAssignment: assignment | null;
  targetGrade: number;
};

export type globalDataStore = {
  classes: Record<string, schoolClass>;
  addClass: (newClass: schoolClass) => void;
  removeSelectedAssignment: (classId: string) => void;
  pickSelectedAssignment: (classId: string, a: assignment, b: bucket) => void;
  setTargetGrade: (classId: string, newTarget: number) => void;
  addNewAssignment: (classId: string, bucketId: string) => void;
  removeAssignment: (
    classId: string,
    bucketId: string,
    assignmentId: string
  ) => void;
  setAssignmentName: (
    classId: string,
    bucketId: string,
    a: assignment,
    newName: string
  ) => void;
  setAssignmentScore: (
    classId: string,
    bucketId: string,
    a: assignment,
    newScore: number
  ) => void;
  setAssignmentOutOf: (
    classId: string,
    bucketId: string,
    a: assignment,
    newOutOf: number
  ) => void;
  simulateAssignment: (
    classId: string,
    bucketId: string,
    a: assignment
  ) => void;
};

export const defaultAssignment: () => assignment = () => ({
  name: "",
  score: 0,
  outOf: 100,
  simulated: false,
  id: uuidv4(),
});

export const defaultBucket: () => bucket = () => ({
  name: "",
  percentage: 0,
  drops: 0,
  assignments: [defaultAssignment()],
  id: uuidv4(),
});

export const probExampleClass: schoolClass = {
  name: "Probability",
  number: "36-218",
  id: uuidv4(),
  weights: [
    {
      name: "Homework",
      percentage: 35,
      drops: 2,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: "Participation",
      percentage: 5,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: "Quizzes",
      percentage: 15,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: "Midterm",
      percentage: 20,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: "Final",
      percentage: 25,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
  ],
  selectedAssignment: defaultAssignment(),
  selectedBucket: defaultBucket(),
  targetGrade: 90,
};

export const softwareExampleClass: schoolClass = {
  name: "Software",
  number: "17-214",
  id: uuidv4(),
  weights: [
    {
      name: "Homework",
      percentage: 50,
      drops: 2,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: "Midterm 1",
      percentage: 10,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: "Midterm 2",
      percentage: 10,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: "Quizzes",
      percentage: 5,
      drops: 4,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: "Participation",
      percentage: 5,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: "Final",
      percentage: 20,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
  ],
  selectedAssignment: defaultAssignment(),
  selectedBucket: defaultBucket(),
  targetGrade: 90,
};

export const useDataStore: UseBoundStore<StoreApi<globalDataStore>> =
  create<globalDataStore>()(
    persist(
      immer((set, get) => ({
        classes: {} as Record<string, schoolClass>,

        addClass: (newClass: schoolClass) =>
          set((state) => {
            const existing = state.classes.hasOwnProperty(newClass.id);
            if (existing) {
              console.warn("Class already exists");
            } else {
              state.classes[newClass.id] = newClass;
            }
          }),

        removeSelectedAssignment: (classId: string) =>
          set((state) => {
            state.classes[classId].selectedAssignment = null;
          }),

        pickSelectedAssignment: (classId: string, a: assignment, b: bucket) =>
          set((state) => {
            state.classes[classId].selectedAssignment = a;
            state.classes[classId].selectedBucket = b;
          }),

        setTargetGrade: (classId: string, newTarget: number) =>
          set((state) => {
            state.classes[classId].targetGrade = newTarget;
          }),

        addNewAssignment: (classId: string, bucketId: string) =>
          set((state) => {
            state.classes[classId].weights
              .find((x) => x.id === bucketId)!
              .assignments.push(defaultAssignment());
          }),

        removeAssignment: (
          classId: string,
          bucketId: string,
          assignmentId: string
        ) =>
          set((state) => {
            const assignments = state.classes[classId].weights.find(
              (x) => x.id === bucketId
            )!.assignments;
            assignments.splice(
              assignments.findIndex((x) => x.id === assignmentId),
              1
            );
          }),

        setAssignmentName: (
          classId: string,
          bucketId: string,
          a: assignment,
          newName: string
        ) =>
          set((state) => {
            state.classes[classId].weights
              .find((x) => x.id === bucketId)!
              .assignments.find((x) => x.id === a.id)!.name = newName;
          }),

        setAssignmentScore: (
          classId: string,
          bucketId: string,
          a: assignment,
          newScore: number
        ) =>
          set((state) => {
            state.classes[classId].weights
              .find((x) => x.id === bucketId)!
              .assignments.find((x) => x.id === a.id)!.score = newScore;
          }),
        setAssignmentOutOf: (
          classId: string,
          bucketId: string,
          a: assignment,
          newOutOf: number
        ) =>
          set((state) => {
            state.classes[classId].weights
              .find((x) => x.id === bucketId)!
              .assignments.find((x) => x.id === a.id)!.outOf = newOutOf;
          }),
        simulateAssignment: (
          classId: string,
          bucketId: string,
          a: assignment
        ) =>
          set((state) => {
            state.classes[classId].weights
              .find((x) => x.id === bucketId)!
              .assignments.find((x) => x.id === a.id)!.simulated = !a.simulated;
          }),
      })),
      {
        name: "finals-calculator",
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
