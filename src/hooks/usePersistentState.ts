import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { localStorageRepository } from "../services/localStorageRepository";

export function usePersistentState<Value>(
  key: string,
  initialValue: Value,
): [Value, Dispatch<SetStateAction<Value>>] {
  const [value, setValue] = useState(() =>
    localStorageRepository.get(key, initialValue),
  );

  useEffect(() => {
    localStorageRepository.set(key, value);
  }, [key, value]);

  const updateValue = useCallback<Dispatch<SetStateAction<Value>>>(
    (nextValue) => setValue(nextValue),
    [],
  );

  return [value, updateValue];
}
