import React, { Component } from 'react'

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

const startMenuItems = [
  { label: 'Programs', subMenuItems: [
      { label: 'Program 1', onSelect: startMenuItemSelected },
      { label: 'Program 2', onSelect: startMenuItemSelected },
      { label: 'Program 3', subMenuItems: [
          { label: 'herp', onSelect: startMenuItemSelected },
          { label: 'derp', onSelect: startMenuItemSelected },
        ] },
    ] },
  { label: 'Documents', onSelect: startMenuItemSelected },
  { label: 'Settings', onSelect: startMenuItemSelected },
  { label: 'Find', onSelect: startMenuItemSelected },
  { label: 'Help', onSelect: startMenuItemSelected },
  { label: 'Run...', onSelect: startMenuItemSelected },
  'divider',
  { label: 'Shut down...', onSelect: startMenuItemSelected },
]

class App extends Component {
  render() {
    return (
      <Shell>
        <Desktop>
          <IconArea desktop iconTextColor="white">
            <IconRegular label="An icon" icon={folderIcon} onDoubleClick={action('icon double clicked')}/>
            <IconRegular label="Another icon" onDoubleClick={action('icon double clicked')}/>
            <IconRegular label="A third icon" onDoubleClick={action('icon double clicked')}/>
          </IconArea>
          <WindowLayer>
            <Folder icon={folderIcon} title="A window" hasFocus>
              {sequentialArray(30).map(i => <IconRegular label="And YOU get an icon!" key={i}/>)}
            </Folder>
            <WordPad icon={defaultIcon} hasFocus>
              <h1>Content!</h1>
              <p>Here's some content. Here's some content. Here's some content. Here's some content. Here's some content. Here's some content.</p>
              <img src="http://lorempixel.com/400/300/cats/" alt="Obligatory cat photo"/>
            </WordPad>
          </WindowLayer>
        </Desktop>
        <Taskbar startMenuItems={startMenuItems}>
          <TaskbarItem title="A taskbar item" icon={folderIcon}/>
          <TaskbarItem title="Another taskbar item" icon={folderIcon}/>
          <TaskbarItem title="Long title on another taskbar item" icon={folderIcon}/>
        </Taskbar>
      </Shell>
    )
  }
}

export default App
