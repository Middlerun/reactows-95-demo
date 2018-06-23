export const OPEN_WINDOOW = 'OPEN_WINDOW'
export const FOCUS_WINDOW = 'FOCUS_WINDOW'
export const CLOSE_WINDOOW = 'CLOSE_WINDOW'

export function openWindow(appName) {
  return {
    type: OPEN_WINDOOW,
    appName,
  }
}

export function focusWindow(windowId) {
  return {
    type: FOCUS_WINDOW,
    windowId,
  }
}

export function closeWindow(windowId) {
  return {
    type: CLOSE_WINDOOW,
    windowId,
  }
}
