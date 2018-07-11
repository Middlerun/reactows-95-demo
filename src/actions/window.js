export const OPEN_WINDOOW = 'OPEN_WINDOW'
export const FOCUS_WINDOW = 'FOCUS_WINDOW'
export const SET_WINDOW_TITLE = 'SET_WINDOW_TITLE'
export const SET_WINDOW_MINIMIZED = 'SET_WINDOW_MINIMIZED'
export const SET_WINDOW_MAXIMIZED = 'SET_WINDOW_MAXIMIZED'
export const CLOSE_WINDOOW = 'CLOSE_WINDOW'

export function openWindow(appName, fileName, data) {
  return {
    type: OPEN_WINDOOW,
    appName,
    fileName,
    data,
  }
}

export function focusWindow(windowId) {
  return {
    type: FOCUS_WINDOW,
    windowId,
  }
}

export function setWindowTitle(windowId, title) {
  return {
    type: SET_WINDOW_TITLE,
    windowId,
    title,
  }
}

export function setWindowMinimized(windowId, isMinimized) {
  return {
    type: SET_WINDOW_MINIMIZED,
    windowId,
    isMinimized,
  }
}

export function setWindowMaximized(windowId, isMaximized) {
  return {
    type: SET_WINDOW_MAXIMIZED,
    windowId,
    isMaximized,
  }
}

export function closeWindow(windowId) {
  return {
    type: CLOSE_WINDOOW,
    windowId,
  }
}
