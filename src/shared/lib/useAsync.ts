import { useCallback, useEffect, useState, type DependencyList } from 'react'

export type AsyncState<T> =
  | { status: 'loading'; data: undefined; error: null; retry: () => void }
  | { status: 'ready'; data: T; error: null; retry: () => void }
  | { status: 'error'; data: undefined; error: string; retry: () => void }

// one loading/ready/error shape for every data call, so each concept can draw all three states
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList): AsyncState<T> {
  const [tick, setTick] = useState(0)
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error'; data?: T; error: string | null }>({ status: 'loading', error: null })
  const retry = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let live = true
    setState({ status: 'loading', error: null })
    fn().then(
      (data) => live && setState({ status: 'ready', data, error: null }),
      (e: unknown) => live && setState({ status: 'error', error: e instanceof Error ? e.message : 'Something went wrong.' }),
    )
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  return { ...state, retry } as AsyncState<T>
}
