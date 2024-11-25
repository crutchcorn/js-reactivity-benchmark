import {
  Computed,
  Effect,
  endBatch,
  Signal,
  startBatch,
} from "alien-signals/esm";
import { ReactiveFramework } from "../util/reactiveFramework";

export const alienFramework: ReactiveFramework = {
  name: "alien-signals",
  signal: (initial) => {
    const data = new Signal(initial);
    return {
      read: () => data.get(),
      write: (v) => data.set(v),
      identity: () => data,
    };
  },
  computed: (fn) => {
    const c = new Computed(fn);
    return {
      read: () => c.get(),
      identity: () => c,
    };
  },
  effect: (fn) => new Effect(fn).run(),
  withBatch: (fn) => {
    startBatch();
    fn();
    endBatch();
  },
  withBuild: (fn) => fn(),
};
