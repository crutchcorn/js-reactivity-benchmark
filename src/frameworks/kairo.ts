import { ReactiveFramework } from "../util/reactiveFramework";
import { batch, computed, effect, mutValue } from "kairo";
import { collectScope } from "kairo";

// NOTE: The kairo adapter is currently not working and unused.

export const kairoFramework: ReactiveFramework = {
  name: "kairo",
  signal: (initialValue) => {
    const val = mutValue(initialValue);
    const [get, write] = val;
    return {
      read: () => get.value,
      write: (v) => write(v),
      identity: () => get,
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
  withBuild: (fn) => {
    const endCollectScope = collectScope();
    let out = fn();
    endCollectScope();
    return out;
  },
};
