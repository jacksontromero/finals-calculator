import {
  defaultAssignment,
  defaultBucket,
  schoolClass,
  SelectingStates,
} from './store';
import { v4 as uuidv4 } from 'uuid';

export const probExampleClass: schoolClass = {
  name: 'Probability',
  number: '36-218',
  id: uuidv4(),
  weights: [
    {
      name: 'Homework',
      percentage: 35,
      drops: 2,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: 'Participation',
      percentage: 5,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: 'Quizzes',
      percentage: 15,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: 'Midterm',
      percentage: 20,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: 'Final',
      percentage: 25,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
  ],
  selectingState: SelectingStates.FIRST_LOAD,
  selectedAssignment: defaultAssignment(),
  selectedBucket: defaultBucket(),
  targetGrade: 90,
};

export const softwareExampleClass: schoolClass = {
  name: 'Software',
  number: '17-214',
  id: uuidv4(),
  weights: [
    {
      name: 'Homework',
      percentage: 50,
      drops: 2,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: 'Midterm 1',
      percentage: 10,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: 'Midterm 2',
      percentage: 10,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: 'Quizzes',
      percentage: 5,
      drops: 4,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: 'Participation',
      percentage: 5,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
    {
      name: 'Final',
      percentage: 20,
      drops: 0,
      id: uuidv4(),
      assignments: [],
    },
  ],
  selectingState: SelectingStates.FIRST_LOAD,

  selectedAssignment: defaultAssignment(),
  selectedBucket: defaultBucket(),
  targetGrade: 90,
};
