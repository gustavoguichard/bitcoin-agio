import { useRef, useEffect, MutableRefObject } from 'react'

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback: MutableRefObject<Function | undefined> = useRef()
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  // Set up the interval.
  useEffect(() => {
    const tick = () => !!savedCallback.current && savedCallback.current()
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export const useOnMount = (callback: () => void): void => {
  useEffect(() => {
    callback()
    // eslint-disable-next-line
  }, [])
}
