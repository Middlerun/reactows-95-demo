import React, { Component } from 'react'
import {connect} from 'react-redux'

import { openWindow, focusWindow, closeWindow } from './actions/window'
import {
  Desktop,
  Folder,
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

class App extends Component {
  renderWindows() {
    const { windowState, focusWindow, closeWindow } = this.props

    return windowState.list.map(win => {
      const closeFunc = () => closeWindow(win.id)
      const focusFunc = () => focusWindow(win.id)

      if (win.appName === 'wordpad') {
        return <WordPad
          icon={defaultIcon}
          hasFocus={win.focused}
          key={win.id}
          onMouseDown={focusFunc}
          onRequestClose={closeFunc}
          zIndex={win.zIndex}
        >
          <h1>Content!</h1>
          <p>Here's some content. Here's some content. Here's some content. Here's some content. Here's some content. Here's some content.</p>
          <img src="http://loremflickr.com/400/300/cats/" alt="Obligatory cat photo"/>
        </WordPad>
      }

      if (win.appName === 'folder') {
        return <Folder
          icon={folderIcon}
          title="A window"
          hasFocus={win.focused}
          key={win.id}
          onMouseDown={focusFunc}
          onRequestClose={closeFunc}
          zIndex={win.zIndex}
        >
          {sequentialArray(30).map(i => <IconRegular label="And YOU get an icon!" key={i}/>)}
        </Folder>
      }

      return null
    })
  }

  renderTaskbarItems() {
    const { windowState, focusWindow } = this.props

    return windowState.list.map(win => {
      const focusFunc = () => focusWindow(win.id)

      if (win.appName === 'wordpad') {
        return <TaskbarItem label="A taskbar item" icon={defaultIcon} key={win.id} onClick={focusFunc}/>
      }

      if (win.appName === 'folder') {
        return <TaskbarItem label="A taskbar item" icon={folderIcon} key={win.id} onClick={focusFunc}/>
      }

      return null
    })
  }

  render() {
    const { openWindow } = this.props

    return (
      <Shell>
        <Desktop>
          <IconArea desktop iconTextColor="white">
            <IconRegular label="An icon" icon={folderIcon} onDoubleClick={() => openWindow('folder')}/>
            <IconRegular label="Another icon" onDoubleClick={() => openWindow('wordpad')}/>
            <IconRegular label="A third icon" onDoubleClick={() => openWindow('wordpad')}/>
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
  closeWindow,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
