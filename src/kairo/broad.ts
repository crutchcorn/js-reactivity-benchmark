import { Counter } from "../util/dependencyGraph";
import { Computed, ReactiveFramework } from "../util/reactiveFramework";

/** broad propagation */
export function broadPropagation(bridge: ReactiveFramework) {
  let head = bridge.signal(0);
  let last = head as Computed<number>;
  let callCounter = new Counter();
  for (let i = 0; i < 50; i++) {
    let current = bridge.computed(() => {
      return head.read() + i;
    }, [head]);
    let current2 = bridge.computed(() => {
      return current.read() + 1;
    }, [current]);
    bridge.effect(() => {
      current2.read();
      callCounter.count++;
    }, [current2]);
    last = current2;
  }

  return () => {
    bridge.withBatch(() => {
      head.write(1);
    });
    // const atleast = 50 * 50;
    callCounter.count = 0;
    for (let i = 0; i < 50; i++) {
      bridge.withBatch(() => {
        head.write(i);
      });
      console.assert(last.read() === i + 50);
    }
    // console.assert(callCounter.count === atleast, callCounter.count);
  };
}
