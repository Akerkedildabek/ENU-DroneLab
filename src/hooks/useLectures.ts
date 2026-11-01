import { useEffect, useState } from 'react'
import type { LectureDatabase } from '../types/lecture'
import { assetUrl } from '../lib/assets'

type State = { data: LectureDatabase | null; loading: boolean; error: string | null }
export function useLectures(): State {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null })
  useEffect(() => {
    const controller = new AbortController()
    fetch(assetUrl('data/lectures.json'), { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json() as Promise<LectureDatabase>
      })
      .then((data) => {
        if (!Array.isArray(data.lectures)) throw new Error('Дәрістер тізімі қате берілген')
        setState({ data, loading: false, error: null })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Белгісіз қате' })
      })
    return () => controller.abort()
  }, [])
  return state
}
