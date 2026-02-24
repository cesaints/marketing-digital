"use client";

import { useEffect, useMemo, useState } from "react";

type Options<T> = {
  key: string;
  defaultValue: T;
};

export function useLocalStorageState<T>({ key, defaultValue }: Options<T>) {
  const [state, setState] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  const read = useMemo(
    () => () => {
      if (typeof window === "undefined") return defaultValue;
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return defaultValue;
        return JSON.parse(raw) as T;
      } catch {
        return defaultValue;
      }
    },
    [key, defaultValue]
  );

  useEffect(() => {
    setState(read());
    setHydrated(true);
  }, [read]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // quota excedida ou bloqueio de storage – ignorar no MVP
    }
  }, [key, state, hydrated]);

  return { state, setState, hydrated } as const;
}
