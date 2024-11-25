import { Computed, ReactiveFramework, Signal } from "../util/reactiveFramework";
import { Store, Derived, Effect } from "@tanstack/store";

export const tanstackFramework: ReactiveFramework = {
  name: "@tanstack/store",
  signal: (initialValue) => {
    const s = new Store(initialValue);
    return {
      write: (v) => s.setState(() => v),
      read: () => s.state,
      identity: () => s,
    };
  },
  computed: (fn, deps) => {
    const c = new Derived(
      deps.map((dep) => dep.identity()),
      fn
    );
    return {
      read: () => c.state,
      identity: () => c,
    };
  },
  effect: (fn, deps) => effect(fn, deps),
  // Not optimized
  withBatch: (fn) => fn(),
  withBuild: (fn) => fn(),
};

function effect(
  effectFn: () => void,
  deps: Array<Signal<any> | Computed<any>>
): void {
  new Effect(
    deps.map((dep) => dep.identity()),
    effectFn
  );
  // Run it immediately
  effectFn();
}
