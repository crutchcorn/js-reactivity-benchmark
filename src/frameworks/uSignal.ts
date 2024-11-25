import { ReactiveFramework } from "../util/reactiveFramework";
import { batch, computed, effect, signal } from "usignal";

export const usignalFramework: ReactiveFramework = {
  name: "uSignal",
  signal: (initialValue) => {
    const s = signal(initialValue);
    return {
      write: (v) => (s.value = v),
      read: () => s.value,
      identity: () => s,
    };
  },
  computed: (fn) => {
    const c = computed(fn);
    return {
      read: () => c.value,
      identity: () => c,
    };
  },
  effect: (fn) => effect(fn),
  withBatch: (fn) => batch(fn),
  withBuild: (fn) => fn(),
};
