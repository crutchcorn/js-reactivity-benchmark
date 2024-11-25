import { ReactiveFramework } from "../util/reactiveFramework";
import { busy } from "./util";

/** avoidable change propagation  */
export function avoidablePropagation(bridge: ReactiveFramework) {
  let head = bridge.signal(0);
  let computed1 = bridge.computed(() => head.read(), [head]);
  let computed2 = bridge.computed(() => (computed1.read(), 0), [computed1]);
  let computed3 = bridge.computed(
    () => (busy(), computed2.read() + 1),
    [computed2]
  ); // heavy computation
  let computed4 = bridge.computed(() => computed3.read() + 2, [computed3]);
  let computed5 = bridge.computed(() => computed4.read() + 3, [computed4]);
  bridge.effect(() => {
    computed5.read();
    busy(); // heavy side effect
  }, [computed5]);

  return () => {
    bridge.withBatch(() => {
      head.write(1);
    });
    console.assert(computed5.read() === 6);
    for (let i = 0; i < 1000; i++) {
      bridge.withBatch(() => {
        head.write(i);
      });
      console.assert(computed5.read() === 6);
    }
  };
}
