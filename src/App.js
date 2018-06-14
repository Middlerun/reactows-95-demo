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
  ICON_FOLDER,
  ICON_RICH_TEXT,
} from 'reactows-95'

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

class App extends Component {
  render() {
    return (
      <Shell>
        <Desktop>
          <IconArea desktop iconTextColor="white">
            <IconRegular label="An icon" icon={ICON_FOLDER} onDoubleClick={action('icon double clicked')}/>
            <IconRegular label="Another icon" onDoubleClick={action('icon double clicked')}/>
            <IconRegular label="A third icon" onDoubleClick={action('icon double clicked')}/>
          </IconArea>
          <WindowLayer>
            <Folder title="A window" hasFocus>
              {sequentialArray(30).map(i => <IconRegular label="And YOU get an icon!" icon={ICON_RICH_TEXT} key={i}/>)}
            </Folder>
            <WordPad hasFocus>
              <h1>Content!</h1>
              <p>Here's some content. Here's some content. Here's some content. Here's some content. Here's some content. Here's some content.</p>
              <img src="http://lorempixel.com/400/300/cats/" alt="Obligatory cat photo"/>
            </WordPad>
          </WindowLayer>
        </Desktop>
        <Taskbar onStartButtonClick={action('start button clicked')}>
          <TaskbarItem title="A taskbar item" icon={ICON_FOLDER}/>
          <TaskbarItem title="Another taskbar item" icon={ICON_FOLDER}/>
          <TaskbarItem title="Long title on another taskbar item" icon={ICON_FOLDER}/>
        </Taskbar>
      </Shell>
    )
  }
}

export default App
