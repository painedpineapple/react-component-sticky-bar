import React from 'react'
//
import Container from './index.style'

type tProps = {
  children: any,
  styles?: {},
  activeStyles?: {},
  readyStyles?: {},
  hiddenStyles?: {},
  forceTriggerTopUpdate?: boolean,
  forceSelfTopUpdate?: boolean,
}

type tState = {
  scrollTop: number,
  position: 'default' | 'hidden' | 'active' | 'ready',
  triggerTop: number,
  selfTop: number,
  hasMoved: boolean, // not isSticky because
}

export class StickyBar extends React.Component<tProps, tState> {
  state = {
    scrollLast: 0,
    scrollTop: 0,
    position: 'default',
    hasMoved: false,
    rendered: false,
  }
  triggerEl: any
  forceTriggerTopUpdate = false
  forceSelfTopUpdate = false
  forceSelfTopUpdate = false
  selfHeight: number
  constructor(props: tProps) {
    super(props)

    if (props.forceTriggerTopUpdate !== undefined)
      this.forceTriggerTopUpdate = props.forceTriggerTopUpdate
    if (props.forceSelfTopUpdate !== undefined)
      this.forceSelfTopUpdate = props.forceSelfTopUpdate
  }
  componentDidMount() {
    if (typeof document !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll, false)

      this.selfHeight = this.ref.offsetHeight

      let triggerTop = 0
      let selfTop = 0

      this.triggerEl = this.ref
      triggerTop = this.ref.offsetTop
      selfTop = triggerTop

      this.setState({ triggerTop, triggerTopBeforeMoved: triggerTop, selfTop })
    }
  }
  getSnapshotBeforeUpdate(prevProps: tProps, prevState: tState) {
    let snapshot = {}
    let currentTriggerTop = this.triggerEl.offsetTop
    let currentSelfTop = this.ref.offsetTop

    if (
      (currentTriggerTop !== prevState.triggerTop && !prevState.hasMoved) ||
      (!this.forceTriggerTopUpdate && this.props.forceTriggerTopUpdate)
    ) {
      snapshot.newTriggerTop = currentTriggerTop
    }

    if (
      (currentSelfTop !== prevState.selfTop && !prevState.hasMoved) ||
      (!this.forceSelfTopUpdate && this.props.forceSelfTopUpdate)
    ) {
      snapshot.newSelfTop = currentSelfTop
    }

    if (Object.keys(snapshot).length === 0 && snapshot.constructor === Object) {
      return snapshot
    }

    return null
  }
  componentDidUpdate(prevProps: tProps, prevState: tState, snapshot?: {}) {
    // need to do this again here incase images or other things have rendered after the componentDidMount
    this.selfHeight = this.ref.offsetHeight

    if (snapshot !== null && (snapshot.newTriggerTop || snapshot.newSelfTop)) {
      this.setState({
        triggerTop: snapshot.newTriggerTop || prevState.triggerTop,
        selfTop: snapshot.newSelfTop || prevState.selfTop,
      })
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

      this.setState(prevState => {
        let position = prevState.position
        let hasMoved = prevState.hasMoved

        const pastBottom =
          scrollTop >= prevState.triggerTop + this.triggerEl.offsetHeight
        const pastAnimationThreshold =
          scrollTop >= (prevState.triggerTop + this.triggerEl.offsetHeight) * 2
        const scrollingUp = scrollTop < prevState.scrollTop

        if (pastAnimationThreshold && scrollingUp) {
          position = 'active'
          hasMoved = true
        } else if (
          (pastAnimationThreshold && !scrollingUp) ||
          (!pastAnimationThreshold && pastBottom && scrollingUp)
        ) {
          position = 'ready'
          hasMoved = true
        } else if (pastBottom && !scrollingUp) {
          position = 'hidden'
          hasMoved = true
        } else {
          position = 'default'
          hasMoved = false
        }

        return {
          scrollTop,
          position,
          hasMoved,
        }
      })
    }
  }
  render() {
    const {
      children,
      styles,
      activeStyles,
      readyStyles,
      hiddenStyles,
      forceSelfTopUpdate,
      forceTriggerTopUpdate,
      ...props
    } = this.props

    return (
      <Container
        {...props}
        innerRef={containerRef => {
          this.ref = containerRef
        }}
        {...{
          selfHeight: this.selfHeight,
          position: this.state.position,
          styles: styles || {},
          activeStyles: activeStyles || {},
          readyStyles: readyStyles || {},
          hiddenStyles: hiddenStyles || {},
        }}
      >
        {children}
      </Container>
    )
  }
}
