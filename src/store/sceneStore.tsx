import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { TIME_MODE_BY_KEY, type TimeModeKey } from '../data/timeModes'
import type { HallLayout } from '../data/layouts'
import type { ZoneKey } from '../data/room'

export interface SceneState {
  mode: TimeModeKey
  /** 讲座角当前形态：随时间段自动切换，也可由用户手动覆盖 */
  layout: HallLayout
  selectedZone: ZoneKey | null
  hoveredZone: ZoneKey | null
  showOccupants: boolean
  showLabels: boolean
  /** 自增即触发相机复位 */
  resetToken: number
}

type Action =
  | { type: 'setMode'; mode: TimeModeKey }
  | { type: 'setLayout'; layout: HallLayout }
  | { type: 'selectZone'; zone: ZoneKey | null }
  | { type: 'hoverZone'; zone: ZoneKey | null }
  | { type: 'toggleOccupants' }
  | { type: 'toggleLabels' }
  | { type: 'resetView' }

const INITIAL: SceneState = {
  mode: 'cocreate',
  layout: TIME_MODE_BY_KEY.cocreate.layout,
  selectedZone: null,
  hoveredZone: null,
  showOccupants: true,
  showLabels: true,
  resetToken: 0,
}

function reducer(state: SceneState, action: Action): SceneState {
  switch (action.type) {
    case 'setMode':
      return {
        ...state,
        mode: action.mode,
        layout: TIME_MODE_BY_KEY[action.mode].layout,
        resetToken: state.resetToken,
      }
    case 'setLayout':
      return { ...state, layout: action.layout }
    case 'selectZone':
      return { ...state, selectedZone: action.zone }
    case 'hoverZone':
      return { ...state, hoveredZone: action.zone }
    case 'toggleOccupants':
      return { ...state, showOccupants: !state.showOccupants }
    case 'toggleLabels':
      return { ...state, showLabels: !state.showLabels }
    case 'resetView':
      return { ...state, selectedZone: null, resetToken: state.resetToken + 1 }
  }
}

const StateContext = createContext<SceneState | null>(null)
const DispatchContext = createContext<Dispatch<Action> | null>(null)

export function SceneProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useSceneState(): SceneState {
  const ctx = useContext(StateContext)
  if (!ctx) throw new Error('useSceneState 必须在 SceneProvider 内使用')
  return ctx
}

export interface SceneActions {
  setMode: (mode: TimeModeKey) => void
  setLayout: (layout: HallLayout) => void
  selectZone: (zone: ZoneKey | null) => void
  hoverZone: (zone: ZoneKey | null) => void
  toggleOccupants: () => void
  toggleLabels: () => void
  resetView: () => void
}

export function useSceneActions(): SceneActions {
  const dispatch = useContext(DispatchContext)
  if (!dispatch) throw new Error('useSceneActions 必须在 SceneProvider 内使用')
  return useMemo(
    () => ({
      setMode: (mode) => dispatch({ type: 'setMode', mode }),
      setLayout: (layout) => dispatch({ type: 'setLayout', layout }),
      selectZone: (zone) => dispatch({ type: 'selectZone', zone }),
      hoverZone: (zone) => dispatch({ type: 'hoverZone', zone }),
      toggleOccupants: () => dispatch({ type: 'toggleOccupants' }),
      toggleLabels: () => dispatch({ type: 'toggleLabels' }),
      resetView: () => dispatch({ type: 'resetView' }),
    }),
    [dispatch],
  )
}
