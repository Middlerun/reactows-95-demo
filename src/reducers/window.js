import { OPEN_WINDOOW, FOCUS_WINDOW, CLOSE_WINDOOW} from '../actions/window'

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
        ...state.list.map(win => setFocusedOrNot(win, newWinId)),
        {
          id: newWinId,
          appName: action.appName,
          content: null,
          focused: true,
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

      newWinList = state.list.map(win => setFocusedOrNot(win, action.windowId))
      return {
        ...state,
        list: updateZIndices(newWinList)
      }
    case CLOSE_WINDOOW:
      const closedWindow = state.list.find(win => win.id === action.windowId)
      if (!closedWindow && !closedWindow.focused) {
        return state
      }

      newWinList = state.list.filter(win => win.id !== action.windowId)
      const highestWindow = findHighestWindow(newWinList)
      if (highestWindow) {
        newWinList = newWinList.map(win => setFocusedOrNot(win, highestWindow.id))
      }

      return {
        ...state,
        list: newWinList
      }
    default:
      return state
  }
}

function findHighestWindow(winList) {
  let topZIndex = -1
  let highestWindow = null
  winList.forEach(win => {
    if (win.zIndex > topZIndex) {
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
    .sort((a, b) => a.zIndex - b.zIndex)
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
