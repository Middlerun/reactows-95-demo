import {
  OPEN_WINDOOW,
  FOCUS_WINDOW,
  SET_WINDOW_MINIMIZED,
  SET_WINDOW_MAXIMIZED,
  CLOSE_WINDOOW,
} from '../actions/window'

const MAX_INT = 2147483647

const initialState = {
  list: [],
}

function nextId() {
  if (typeof nextId.value === 'undefined') {
    nextId.value = 0
  }
  nextId.value++
  return nextId.value
}

export default function (state = initialState, action) {
  let newWinList
  switch (action.type) {
    case OPEN_WINDOOW:
      const newWinId = nextId()
      newWinList = [
        ...focusWindowById(state.list, newWinId),
        {
          id: newWinId,
          appName: action.appName,
          content: null,
          focused: true,
          minimized: false,
          maximized: false,
        }
      ]

      return {
        ...state,
        list: updateZIndices(newWinList)
      }
    case FOCUS_WINDOW:
      if (state.list.find(win => win.id === action.windowId).focused) {
        // Already focused, nothing to do
        return state
      }

      newWinList = focusWindowById(state.list, action.windowId)
      return {
        ...state,
        list: updateZIndices(newWinList)
      }
    case SET_WINDOW_MINIMIZED:
      newWinList = state.list.map(win => {
        if (win.id === action.windowId) {
          return {
            ...win,
            minimized: action.isMinimized,
            zIndex: action.isMinimized ? 0 : MAX_INT
          }
        }
        return win
      })

      newWinList = updateZIndices(newWinList)
      newWinList = focusHighestWindow(newWinList)

      return {
        ...state,
        list: newWinList,
      }
    case SET_WINDOW_MAXIMIZED:
      newWinList = state.list.map(win => {
        if (win.id === action.windowId) {
          return {
            ...win,
            maximized: action.isMaximized,
          }
        }
        return win
      })

      return {
        ...state,
        list: newWinList,
      }
    case CLOSE_WINDOOW:
      const closedWindow = state.list.find(win => win.id === action.windowId)
      if (!closedWindow && !closedWindow.focused) {
        return state
      }

      newWinList = state.list.filter(win => win.id !== action.windowId)
      newWinList = focusHighestWindow(newWinList)

      return {
        ...state,
        list: newWinList
      }
    default:
      return state
  }
}

function focusHighestWindow(winList) {
  const highestWindow = findHighestWindow(winList)
  return focusWindowById(winList, highestWindow ? highestWindow.id : null)
}

function findHighestWindow(winList) {
  let topZIndex = -1
  let highestWindow = null
  winList.forEach(win => {
    if (!win.minimized && win.zIndex > topZIndex) {
      highestWindow = win
      topZIndex = win.zIndex
    }
  })
  return highestWindow
}

function updateZIndices(winList) {
  let focusedWinId
  let orderedWinIds = []

  winList
    .slice(0)
    .sort((a, b) => {
      if (a.minimized && !b.minimized) return -1
      if (b.minimized && !a.minimized) return 1
      return a.zIndex - b.zIndex
    })
    .forEach(win => {
      if (win.focused) {
        focusedWinId = win.id
      } else {
        orderedWinIds.push(win.id)
      }
    })
  if (focusedWinId) {
    orderedWinIds.push(focusedWinId)
  }

  return winList.map(win => {
    const zIndex = orderedWinIds.indexOf(win.id) + 1
    if (zIndex === win.zIndex) {
      return win
    }
    return {
      ...win,
      zIndex,
    }
  })
}

function focusWindowById(winList, windowId) {
  return winList.map(win => setFocusedOrNot(win, windowId))
}

function setFocusedOrNot(win, focusedWindowId) {
  if (win.focused === (win.id === focusedWindowId)) {
    return win
  } else {
    return {
      ...win,
      focused: (win.id === focusedWindowId),
    }
  }
}
