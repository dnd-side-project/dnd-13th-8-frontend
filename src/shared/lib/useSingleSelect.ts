import { useState, useCallback } from 'react'

export const useSingleSelect = <T>(initialValue: T) => {
  const [selected, setSelected] = useState(initialValue)

  const onSelect = useCallback((newValue: T) => {
    setSelected(newValue)
  }, [])

  return { selected, onSelect }
}
