import React from 'react'
import { render } from 'react-dom'
import faker from 'faker'
import _ from 'lodash'
import { injectGlobal } from 'react-emotion'
//
import StickyBar from './StickyBar'
import customStyles, { P } from './styles'

injectGlobal({
  body: {
    margin: 0,
  },
})

class App extends React.Component {
  triggerClass = 'sticky-bar-waypoint-trigger'
  render() {
    return (
      <div>
        <P key={faker.random.uuid()}>{faker.lorem.paragraph()}</P>
        <P key={faker.random.uuid()}>{faker.lorem.paragraph()}</P>

        <StickyBar
          options={{
            triggerClass: this.triggerClass,
            styles: customStyles,
            onlyUp: false,
          }}
        />

        <P key={faker.random.uuid()}>{faker.lorem.paragraph()}</P>
        <P key={faker.random.uuid()}>{faker.lorem.paragraph()}</P>
        <P
          className={this.triggerClass}
          style={{ borderTop: '1px solid red' }}
          key={faker.random.uuid()}
        >
          {faker.lorem.paragraph()}
        </P>
        <div style={{ marginTop: 80 }}>
          {_.times(20, () => (
            <P key={faker.random.uuid()}>{faker.lorem.paragraph()}</P>
          ))}
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
