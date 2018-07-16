import React from 'react'
import { render } from 'react-dom'
import faker from 'faker'
import _ from 'lodash'
import { injectGlobal } from 'react-emotion'
//
import { StickyBar } from './StickyBar'
import customStyles, {
  P,
  activeStyles,
  hiddenStyles,
  readyStyles,
} from './styles'

injectGlobal({
  body: {
    margin: 0,
  },
})

class App extends React.Component {
  render() {
    return (
      <div>
        <P key={faker.random.uuid()}>{faker.lorem.paragraph()}</P>
        <P key={faker.random.uuid()}>{faker.lorem.paragraph()}</P>

        <StickyBar
          {...{
            styles: customStyles,
            activeStyles,
            readyStyles,
            hiddenStyles,
          }}
        >
          Hello World
        </StickyBar>

        {_.times(20, () => (
          <P key={faker.random.uuid()}>{faker.lorem.paragraph()}</P>
        ))}
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
