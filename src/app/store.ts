import { StoreApi, UseBoundStore, create } from "zustand";
import { v4 as uuidv4 } from "uuid";

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
  classes: Map<string, UseBoundStore<StoreApi<schoolClass>>>;
  addClass: (newClass: schoolClass) => void;
};

export const defaultAssignment: assignment = {
  name: "",
  score: 0,
  outOf: 100,
  simulated: false,
  id: uuidv4(),
};

export const defaultBucket: bucket = {
  name: "",
  percentage: 0,
  drops: 0,
  assignments: [defaultAssignment],
  id: uuidv4(),
};

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
  selectedAssignment: defaultAssignment,
  selectedBucket: defaultBucket,
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
  selectedAssignment: defaultAssignment,
  selectedBucket: defaultBucket,
  targetGrade: 90,
};

// idea - create map of class ID to class data store
// the main parent store would create a new map each time a class is added or removed,
// so that components could update when number of classes changes.
// the map values would be stores for that class itself and then each sub component for that class could update only on its own store

export type classStore = schoolClass & {
  removeSelectedAssignment: () => void;
  pickSelectedAssignment: (a: assignment, b: bucket) => void;
  setTargetGrade: (newTarget: number) => void;
};

function createNewClassStore(newClass: schoolClass) {
  const store = create<classStore>((set) => ({
    ...newClass,
    removeSelectedAssignment: () =>
      set((state) => {
        state.selectedAssignment = null;
        state.selectedBucket = null;
        return state;
      }),
    pickSelectedAssignment: (a: assignment, b: bucket) =>
      set((state) => {
        state.selectedAssignment = a;
        state.selectedBucket = b;
        return state;
      }),
    setTargetGrade: (newTarget: number) =>
      set((state) => {
        state.targetGrade = newTarget;
        return state;
      }),
  }));

  return store;
}

export const useDataStore = create<globalDataStore>()((set) => ({
  classes: new Map<string, UseBoundStore<StoreApi<schoolClass>>>(),

  addClass: (newClass: schoolClass) =>
    set((state) => {
      const existing = state.classes.get(newClass.id);
      if (existing) {
        console.warn("Class already exists");
        return state;
      } else {
        const newMap = new Map(state.classes).set(
          newClass.id,
          createNewClassStore(newClass)
        );
        return { classes: newMap };
      }
    }),
}));

export function getClassStore(id: string) {
  const classStore = useDataStore.getState().classes.get(id);

  if (!classStore) {
    throw new Error("Could not find class store");
  } else {
    return classStore;
  }
}
