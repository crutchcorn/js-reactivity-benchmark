import { ReactiveFramework } from "../util/reactiveFramework";
import {
  flushSync,
  createEffect,
  createMemo,
  createRoot,
  createSignal,
} from "@solidjs/reactivity";

export const xReactivityFramework: ReactiveFramework = {
  name: "x-reactivity",
  signal: (initialValue) => {
    const val = createSignal(initialValue);
    const [getter, setter] = val;
    return {
      write: (v) => setter(v),
      read: () => getter(),
      identity: () => val,
    };
  },
  computed: (fn) => {
    const memo = createMemo(fn);
    return {
      read: () => memo(),
      identity: () => memo,
    };
  },
  effect: (fn) => createEffect(fn),
  withBatch: (fn) => {
    fn();
    flushSync();
  },
  withBuild: (fn) => createRoot(fn),
};
