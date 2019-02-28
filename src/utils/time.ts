import { propIs, prop } from 'ramda';

export type DateMap = Record<string, Date>;
let timeRepository: DateMap = {};

export const timeStart = (name: string): void => {
  timeRepository[name] = new Date();
};

export const timeEnd = (name: string): number =>
  propIs(Date, name, timeRepository)
    ? new Date().getTime() - prop(name, timeRepository).getTime()
    : -Infinity;
