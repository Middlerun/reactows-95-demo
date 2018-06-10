import React, { Component } from 'react';

import {
  Shell,
  Desktop,
  IconArea,
  IconRegular,
  Taskbar,
  TaskbarItem,
  WindowLayer,
  Folder,
} from 'reactows-95'

class App extends Component {
  render() {
    return (
      <Shell>
        <Desktop>
          <IconArea desktop iconTextColor="white">
            <IconRegular label="An icon"/>
            <IconRegular label="Another icon"/>
            <IconRegular label="A third icon"/>
          </IconArea>
          <WindowLayer>
            <Folder title="A window" hasFocus>
              {(new Array(30)).fill(1).map((val, i) => <IconRegular label="And YOU get an icon!" key={i}/>)}
            </Folder>
          </WindowLayer>
        </Desktop>
        <Taskbar>
          <TaskbarItem title="A taskbar item"/>
          <TaskbarItem title="Another taskbar item"/>
          <TaskbarItem title="Long title on another taskbar item"/>
        </Taskbar>
      </Shell>
    );
  }
}

export default App;
