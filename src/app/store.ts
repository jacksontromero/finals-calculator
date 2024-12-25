import { create } from "zustand";
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

export type globalData = {
  classes: schoolClass[];
  selectedClassId: string | null;
  selectClass: (id: string) => void;
  addClass: (newClass: schoolClass) => void;
  replaceClass: (id: string, updatedClass: schoolClass) => void;
  removeSelectedAssignment: () => void;
  pickSelectedAssignment: (a: assignment, b: bucket) => void;
  setTargetGrade: (newTarget: number) => void;
  loadAllData: (cachedData: {
    classes: schoolClass[];
    selectedClassId: string | null;
  }) => void;
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

export const useDataStore = create<globalData>()((set) => ({
  classes: [],
  selectedClassId: null,

  selectClass: (id: string) =>
    set((state) => {
      const index = state.classes.findIndex((x) => x.id === id);
      if (index === -1) {
        throw new Error("Class not found");
      }

      return { selectedClassId: id };
    }),

  loadAllData: (cachedData: {
    classes: schoolClass[];
    selectedClassId: string | null;
  }) =>
    set((state) => ({
      classes: cachedData.classes,
      selectedClassId: cachedData.selectedClassId,
    })),

  addClass: (newClass: schoolClass) =>
    set((state) => {
      const index = state.classes.findIndex((x) => x.id === newClass.id);
      if (index !== -1) {
        console.warn("Class already exists");
        return state;
      }

      return { classes: [...state.classes, newClass] };
    }),

  replaceClass: (id: string, updatedClass: schoolClass) =>
    set((state) => {
      if (updatedClass.id !== id) {
        throw new Error("Class ID does not match");
      }

      const index = state.classes.findIndex((x) => x.id === id);
      if (index === -1) {
        throw new Error("Class not found");
      }

      state.classes[index] = updatedClass;
      return { classes: state.classes };
    }),

  /**
   * Sets selected assignment and bucket to null for the selected class
   */
  removeSelectedAssignment: () =>
    set((state) => {
      const index = getSelectedClass().idx;
      state.classes[index].selectedAssignment = null;
      state.classes[index].selectedBucket = null;
      return { classes: state.classes };
    }),

  /**
   * Sets the target assignment and target bucket for the selected class
   * @param a The assignment to pick
   * @param b The bucket to pick (that a is in)
   */
  pickSelectedAssignment: (a: assignment, b: bucket) =>
    set((state) => {
      const index = getSelectedClass().idx;
      state.classes[index].selectedAssignment = a;
      state.classes[index].selectedBucket = b;
      return { classes: state.classes };
    }),

  /**
   * Set the target grade for the selected class
   * @param newTarget The new target grade
   */
  setTargetGrade: (newTarget: number) =>
    set((state) => {
      const index = getSelectedClass().idx;
      state.classes[index].targetGrade = newTarget;
      return { classes: state.classes };
    }),
}));

export function getSelectedClass() {
  const selectedClassId = useDataStore((state) => state.selectedClassId);
  const selectedClassIdx = useDataStore((state) =>
    state.classes.findIndex((x) => x.id === selectedClassId)
  );

  if (selectedClassIdx === -1) {
    throw new Error("Could not find selected class");
  }

  const selected = useDataStore((state) => state.classes[selectedClassIdx]);

  return {
    idx: selectedClassIdx,
    class: selected,
  };
}
