import { ReactiveFramework } from "../util/reactiveFramework";
import {
  batch,
  createRenderEffect,
  createMemo,
  createRoot,
  createSignal,
} from "solid-js/dist/solid.cjs";

export const solidFramework: ReactiveFramework = {
  name: "SolidJS",
  signal: (initialValue) => {
    const val = createSignal(initialValue);
    const [getter, setter] = val;
    return {
      write: (v) => setter(v as any),
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
  effect: (fn) => createRenderEffect(fn),
  withBatch: (fn) => batch(fn),
  withBuild: (fn) => createRoot(fn),
};
