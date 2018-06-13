import React from 'react'
//
import Container from './index.style'

type tProps = {
  options: {
    onlyUp: boolean, // only activates when scrolling up, defaults to true
    triggerClass?: string, // if you don't want the sticky aspect to trigger until after a certain element, pass the className used by that element
    styles?: {},
  },
}

type tState = {
  scrollTop: number,
  scrollIsPastTrigger: boolean,
  scrollIsPastSelf: boolean,
  triggerTop: number,
  scrollingUp: boolean,
}

export default class StickyBar extends React.Component<tProps, tState> {
  state = {
    scrollLast: 0,
    scrollTop: 0,
    scrollIsPastTrigger: false,
    scrollIsPastSelf: false,
    scrollingUp: false,
  }
  triggerEl: any
  bottomOfSelf: number
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }
  componentDidMount() {
    this.bottomOfSelf =
      this.ref.current.offsetHeight + this.ref.current.offsetTop

    this.onlyUp = this.props.options.onlyUp || true

    if (typeof document !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll, false)

      let triggerTop = 0

      console.log('triggerCLass', this.props.options.triggerClass)

      if (this.props.options.triggerClass) {
        this.triggerEl = document.getElementsByClassName(
          this.props.options.triggerClass,
        )[0]

        triggerTop = this.triggerEl.offsetTop
      }

      this.setState({ triggerTop })
    }
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    let snapshot = {}
    if (this.props.options.triggerClass) {
      const currentTriggerTop = this.triggerEl.offsetTop
      if (currentTriggerTop !== prevState.triggerTop) {
        snapshot.newTriggerTop = currentTriggerTop
        return snapshot
      }
    }
    return null
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null && snapshot.newTriggerTop) {
      this.setState({ triggerTop: snapshot.newTriggerTop })
    }
  }
  componentWillUnmount() {
    if (typeof document !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll, false)
    }
  }
  handleScroll = () => {
    if (typeof document !== 'undefined') {
      const scrollTop =
        window.pageYOffset ||
        (document.documentElement ? document.documentElement.scrollTop : 0)

      this.setState({
        scrollTop,
        scrollIsPastTrigger: scrollTop > this.state.triggerTop,
        scrollIsPastSelf: scrollTop > this.bottomOfSelf,
        scrollingUp: scrollTop < this.state.scrollTop,
      })
    }
  }
  render() {
    const { options, ...attrs } = this.props
    return (
      <div ref={this.ref}>
        <Container
          {...attrs}
          options={{
            ...options,
            onlyUp: this.onlyUp,
            scrollingUp: this.state.scrollingUp,
            scrollIsPastSelf: this.state.scrollIsPastSelf,
            scrollIsPastTrigger: this.state.scrollIsPastTrigger,
            styles: options ? options.styles || {} : {},
          }}
        >
          Hello World
        </Container>
      </div>
    )
  }
}
