"use client";
import { v4 as uuidv4 } from 'uuid';

export type assignment = {
  name: string,
  score: number
  outOf: number,
  id: string,
  simulated: boolean,
}

export type bucket = {
  name: string,
  percentage: number,
  drops: number,
  assignments: assignment[]
  id: string,
}

export type schoolClass = {
  name: string,
  number: string,
  weights: bucket[],
  id: string,
  selectedBucket: bucket | null,
  selectedAssignment: assignment | null,
  targetGrade: number,
}

export type globalData = {
  classes: schoolClass[]
}

export const defaultAssignment: assignment = {
  name: "",
  score: 0,
  outOf: 100,
  simulated: false,
  id: uuidv4()
}

export const defaultBucket: bucket = {
  name: "",
  percentage: 0,
  drops: 0,
  assignments: [defaultAssignment],
  id: uuidv4()
}
