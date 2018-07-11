import React from 'react'
//
import Container from './index.style'

type tProps = {
  children: any,
  onlyUp?: boolean, // only activates when scrolling up, defaults to true
  triggerClass?: string, // if you don't want the sticky aspect to trigger until after a certain element, pass the className used by that element
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
  selfTop: number, // will be the same as triggerTop when no alt trigger is provided (via triggerClass)
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
  triggerIsSelf = false
  onlyUp = true
  forceTriggerTopUpdate = false
  forceSelfTopUpdate = false
  forceSelfTopUpdate = false
  selfHeight: number
  constructor(props: tProps) {
    super(props)

    if (props.onlyUp !== undefined) this.onlyUp = props.onlyUp
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

      if (this.props.triggerClass) {
        this.triggerEl = document.getElementsByClassName(
          this.props.triggerClass,
        )[0]

        triggerTop = this.triggerEl.offsetTop
        selfTop = this.ref.offsetTop
      } else {
        this.triggerIsSelf = true
        this.triggerEl = this.ref
        triggerTop = this.ref.offsetTop
        selfTop = triggerTop
      }

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

        const scrollIsPastTriggerTop = scrollTop >= prevState.triggerTop
        const scrollIsPastTriggerBottom =
          scrollTop >= prevState.triggerTop + this.triggerEl.offsetHeight
        const scrollingUp = scrollTop < prevState.scrollTop
        const reachedSelf =
          scrollTop >= prevState.selfTop + this.ref.offsetHeight

        if (
          (this.onlyUp && scrollingUp && scrollIsPastTriggerTop) ||
          (!this.onlyUp && scrollIsPastTriggerTop)
        ) {
          position = 'active'
          hasMoved = true
        } else if (
          (!this.triggerIsSelf &&
            scrollIsPastTriggerBottom &&
            this.onlyUp &&
            !scrollingUp) ||
          (!this.triggerIsSelf && reachedSelf && this.onlyUp && scrollingUp) ||
          (this.triggerIsSelf &&
            this.onlyUp &&
            !scrollingUp &&
            scrollIsPastTriggerTop)
        ) {
          position = 'ready'
          hasMoved = true
        } else if (
          !this.triggerIsSelf &&
          reachedSelf &&
          this.onlyUp &&
          !scrollingUp
        ) {
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
      onlyUp,
      triggerClass,
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
