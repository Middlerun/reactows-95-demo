import React, { Component } from 'react'
import {connect} from 'react-redux'

import {
  openWindow,
  focusWindow,
  setWindowTitle,
  setWindowMinimized,
  setWindowMaximized,
  closeWindow,
} from './actions/window'
import {
  Desktop,
  Dialog,
  FileBrowser,
  IconArea,
  IconRegular,
  Shell,
  Taskbar,
  TaskbarItem,
  WindowLayer,
  WordPad,
  defaultIcon,
} from 'reactows-95'

import folderIcon from './icon-folder.png'

function action(message) {
  return () => {
    console.log(message)
  }
}

function sequentialArray(count) {
  const array = new Array(count)
  for (let i=0; i<count; i++) { array[i] = i }
  return array
}

function startMenuItemSelected(item) {
  action(item.label + ' selected')()
}

const recursiveStartMenuFolder = { label: 'Recursive Folder' }
recursiveStartMenuFolder.subMenuItems = [recursiveStartMenuFolder]

const startMenuItems = [
  { label: 'Programs', subMenuItems: [
      { label: 'Program 1', onSelect: startMenuItemSelected },
      { label: 'Program 2', onSelect: startMenuItemSelected },
      { label: 'Folder', subMenuItems: [
          { label: 'herp', onSelect: startMenuItemSelected },
          { label: 'derp', onSelect: startMenuItemSelected },
        ] },
      { label: 'Empty Folder', subMenuItems: [] },
      recursiveStartMenuFolder,
      { label: 'Big Folder', subMenuItems: sequentialArray(20).map(val => (
          { label: `Thing ${val+1}`, onSelect: startMenuItemSelected }
        )) },
    ] },
  { label: 'Documents', subMenuItems: [] },
  { label: 'Settings', onSelect: startMenuItemSelected },
  { label: 'Find', onSelect: startMenuItemSelected },
  { label: 'Help', onSelect: startMenuItemSelected },
  { label: 'Run...', onSelect: startMenuItemSelected },
  'divider',
  { label: 'Shut down...', onSelect: startMenuItemSelected },
]

const desktopFileTree = [
  { name: 'Folder 1', type: 'folder', fileTree: [
      { name: 'Folder 3', type: 'folder', fileTree: [
          { name: 'File 5', type: 'rtf', content: 'Hello world!'},
          { name: 'File 6', type: 'rtf', content: 'Hello world!'},
        ]},
      { name: 'File 3', type: 'rtf', content: 'Hello world!'},
      { name: 'File 4', type: 'rtf', content: 'Hello world!'},
    ]},
  { name: 'Folder 2', type: 'folder',
    fileTree: sequentialArray(30).map(i => ({ name: `File ${i+1}`, type: 'rtf', content: `This is file ${i+1}`}))},
  { name: 'File 1', type: 'rtf', content: 'Hello world!'},
  { name: 'File 2', type: 'rtf', contentUrl: 'https://swapi.co/api/people/1/'},
  { name: 'Corrupted file', type: 'rtf', contentUrl: 'https://swapi.co/api/peoples/1/'},
]

class App extends Component {
  constructor() {
    super()
    this.state = {
      filesLoading: 0,
    }
  }

  apps = {
    filebrowser: {
      component: FileBrowser,
      icon: folderIcon,
      renderContent: win => this.fileTreeToIcons(win.data.fileTree),
    },
    wordpad: {
      component: WordPad,
      icon: defaultIcon,
      renderContent: win => win.data.content,
    },
    dialog: {
      component: Dialog,
      renderContent: win => win.data,
    },
  }

  fileTypes = {
    folder: {
      icon: folderIcon,
      appName: 'filebrowser',
    },
    rtf: {
      icon: defaultIcon,
      appName: 'wordpad',
    },
  }

  renderWindows() {
    const {
      windowState,
      focusWindow,
      setWindowTitle,
      setWindowMinimized,
      setWindowMaximized,
      closeWindow,
    } = this.props

    return windowState.list.map(win => {
      const closeFunc = () => closeWindow(win.id)
      const focusFunc = () => focusWindow(win.id)
      const setWindowTitleFunc = (title) => setWindowTitle(win.id, title)
      const setWindowMinimizedFunc = (isMinimized) => setWindowMinimized(win.id, isMinimized)
      const setWindowMaximizedFunc = (isMaximized) => setWindowMaximized(win.id, isMaximized)
      const id = `taskbar-item-${win.id}`

      const app = this.apps[win.appName]

      if (!app) return null

      const Component = app.component

      return <Component
        icon={app.icon}
        title={win.title || 'New window'}
        fileName={win.fileName}
        hasFocus={win.focused}
        minimized={win.minimized}
        maximized={win.maximized}
        key={win.id}
        onMouseDown={focusFunc}
        onSetTitle={setWindowTitleFunc}
        setMinimized={setWindowMinimizedFunc}
        setMaximized={setWindowMaximizedFunc}
        onRequestClose={closeFunc}
        zIndex={win.zIndex}
        taskbarItemId={id}
      >
        {app.renderContent(win)}
      </Component>
    })
  }

  renderTaskbarItems() {
    const {
      windowState,
      focusWindow,
      setWindowMinimized,
    } = this.props

    return windowState.list.map(win => {
      const onClick = (!win.minimized && !win.focused) ?
        () => focusWindow(win.id) :
        () => setWindowMinimized(win.id, !win.minimized)
      const id = `taskbar-item-${win.id}`

      const app = this.apps[win.appName]

      if (!app) return null

      return <TaskbarItem
        label={win.title || 'New window'}
        icon={app.icon}
        key={win.id}
        focused={win.focused}
        onClick={onClick}
        id={id}
      />
    })
  }

  openFile(file, fileType) {
    const { openWindow } = this.props

    if (file.contentUrl) {
      this.setState(state => ({ filesLoading: state.filesLoading + 1 }))
      this.fetchFile(file.contentUrl)
        .then(content => {
          const fileWithContent = {...file, content: content}
          openWindow(fileType.appName, fileWithContent.name, fileWithContent)
        })
        .catch(error => {
          openWindow('dialog', 'Error', error.message)
        })
        .then(() => {
          this.setState(state => ({ filesLoading: state.filesLoading - 1 }))
        })
    } else {
      openWindow(fileType.appName, file.name, file)
    }
  }

  fetchFile(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to open file')
        }
        return response.text()
      })
  }

  fileTreeToIcons(fileTree) {
    return fileTree.map((file, i) => {
      const fileType = this.fileTypes[file.type]

      if (!fileType) return null

      return <IconRegular
        key={i}
        label={file.name}
        icon={fileType.icon}
        onDoubleClick={() => this.openFile(file, fileType)}
      />
    })
  }


  render() {
    return (
      <Shell semiBusy={this.state.filesLoading > 0}>
        <Desktop>
          <IconArea desktop iconTextColor="white">
            {this.fileTreeToIcons(desktopFileTree)}
          </IconArea>
          <WindowLayer>
            {this.renderWindows()}
          </WindowLayer>
        </Desktop>
        <Taskbar startMenuItems={startMenuItems}>
          {this.renderTaskbarItems()}
        </Taskbar>
      </Shell>
    )
  }
}

const mapStateToProps = state => ({
  windowState: state.window,
})

const mapDispatchToProps = {
  openWindow,
  focusWindow,
  setWindowTitle,
  setWindowMinimized,
  setWindowMaximized,
  closeWindow,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
