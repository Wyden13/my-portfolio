import { getConsoleFunction, setConsoleFunction } from "three";

type ConsoleHandler = ReturnType<typeof getConsoleFunction> & {
  filtersLegacyFiberClock?: boolean;
};

// R3F 9.7 constructs THREE.Clock on every Canvas mount. Remove this temporary
// filter when stable R3F uses Timer: https://github.com/pmndrs/react-three-fiber/issues/2688
// Use Three's logging hook, leaving the browser console itself untouched.
const previous = getConsoleFunction() as ConsoleHandler | null;

if (!previous?.filtersLegacyFiberClock) {
  const handler: ConsoleHandler = (type, message, ...params) => {
    if (
      type === "warn" &&
      message ===
        "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead." &&
      params.length === 0
    ) {
      return;
    }

    if (previous) {
      previous(type, message, ...params);
      return;
    }

    // Preserve Three's structured shader/TSL error stack handling as well.
    const stack = params[0] as
      | { isStackTrace?: boolean; getError?: (message: string) => Error }
      | undefined;
    if (type !== "log" && stack?.isStackTrace && stack.getError) {
      console[type](stack.getError(message));
    } else {
      console[type](message, ...params);
    }
  };

  // Avoid wrapping the logger repeatedly during development hot reloads.
  handler.filtersLegacyFiberClock = true;
  setConsoleFunction(handler);
}
