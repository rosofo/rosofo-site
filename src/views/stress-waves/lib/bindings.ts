import _ from "lodash";
import { ReactEventHandlers } from "react-use-gesture/dist/types";

export function mergeBindings(
  ...bindings: ReactEventHandlers[]
): ReactEventHandlers {
  const merge = (
    bindingA: ReactEventHandlers,
    bindingB: ReactEventHandlers
  ) => {
    const sequence = (objValue: any, srcValue: any) => {
      return (event: any) => {
        !_.isUndefined(objValue) && objValue(event);
        !_.isUndefined(srcValue) && srcValue(event);
      };
    };
    const cloneA = { ...bindingA };
    const cloneB = { ...bindingB };

    return _.assignWith(cloneA, cloneB, sequence);
  };

  return bindings.reduce(merge, {});
}
