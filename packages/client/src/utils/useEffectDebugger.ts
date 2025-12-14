import { useEffect, useRef } from 'react';

function usePrevious<T = any>(value: T, initialValue: T) {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  // eslint-disable-next-line react-hooks/refs
  return ref.current;
}

function useDependencyDebugger(
  name: string,
  dependencies: unknown[],
  dependencyNames: string[] = [],
  hookName?: string,
) {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce<Record<string, unknown>>((accumulator, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accumulator,
        [keyName]: {
          after: dependency,
          before: previousDeps[index],
        },
      };
    }

    return accumulator;
  }, {});

  if (Object.keys(changedDeps).length) {
    // eslint-disable-next-line no-console
    console.log(hookName, `(${name})`, changedDeps);
  }
}

export function useEffectDebugger(
  effectHook: () => void,
  dependencies: unknown[],
  dependencyNames: string[] = [],
  hookName?: string,
) {
  useDependencyDebugger(`useEffect`, dependencies, dependencyNames, hookName);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effectHook, dependencies);
}
