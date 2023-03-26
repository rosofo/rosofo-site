import { StoreApi } from "zustand/vanilla";
import {
  ReactiveController,
  ReactiveControllerHost,
  ReactiveElement,
} from "lit";
import { decorateProperty, state } from "@lit/reactive-element/decorators.js";

export class ZustandConsumer<T> implements ReactiveController {
  host;
  key;
  store;
  unsubscribe?: () => void;
  constructor(
    host: ReactiveControllerHost & Record<PropertyKey, T>,
    key: PropertyKey,
    store: StoreApi<T>
  ) {
    this.host = host;
    this.host.addController(this);
    this.key = key;
    this.store = store;
  }

  hostConnected(): void {
    this.host[this.key] = this.store.getState();
    this.unsubscribe = this.store.subscribe((state) => {
      this.host[this.key] = state;
    });
  }

  hostDisconnected(): void {
    this.unsubscribe && this.unsubscribe();
  }
}

export const consumeStore =
  <T>(store: StoreApi<T>) =>
  (protoOrDescriptor: ReactiveElement, name?: PropertyKey | undefined) => {
    const storeDecorator = decorateProperty({
      finisher(ctor, property) {
        ctor.addInitializer((instance) => {
          new ZustandConsumer(instance as any, property, store);
        });
      },
    });

    storeDecorator(protoOrDescriptor, name);
    state()(protoOrDescriptor, name);
  };
