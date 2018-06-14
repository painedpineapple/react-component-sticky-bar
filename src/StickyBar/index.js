import React from 'react'
//
import Container from './index.style'

type tProps = {
  children: any,
  options: {
    onlyUp?: boolean, // only activates when scrolling up, defaults to true
    triggerClass?: string, // if you don't want the sticky aspect to trigger until after a certain element, pass the className used by that element
    styles?: {},
    activeStyles?: {},
    hiddenStyles?: {},
    forceTriggerTopUpdate?: boolean,
    forceSelfTopUpdate?: boolean,
  },
}

type tState = {
  scrollTop: number,
  position: 'default' | 'hidden' | 'active',
  triggerTop: number,
  selfTop: number, // will be the same as triggerTop when no alt trigger is provided (via triggerClass)
  hasMoved: boolean, // not isSticky because
}

export default class StickyBar extends React.Component<tProps, tState> {
  state = {
    scrollLast: 0,
    scrollTop: 0,
    position: 'default',
    hasMoved: false,
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

    let options = this.props.options || {}

    if (options.onlyUp !== undefined) this.onlyUp = options.onlyUp
    if (options.forceTriggerTopUpdate !== undefined)
      this.forceTriggerTopUpdate = options.forceTriggerTopUpdate
    if (options.forceSelfTopUpdate !== undefined)
      this.forceSelfTopUpdate = options.forceSelfTopUpdate
  }
  componentDidMount() {
    if (typeof document !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll, false)

      let options = this.props.options || {}

      this.selfHeight = this.ref.offsetHeight

      let triggerTop = 0
      let selfTop = 0

      if (options.triggerClass) {
        this.triggerEl = document.getElementsByClassName(
          options.triggerClass,
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
    let options = this.props.options || {}
    let currentTriggerTop = this.triggerEl.offsetTop
    let currentSelfTop = this.ref.offsetTop

    if (
      (currentTriggerTop !== prevState.triggerTop && !prevState.hasMoved) ||
      (!this.forceTriggerTopUpdate && options.forceTriggerTopUpdate)
    ) {
      snapshot.newTriggerTop = currentTriggerTop
    }

    if (
      (currentSelfTop !== prevState.selfTop && !prevState.hasMoved) ||
      (!this.forceSelfTopUpdate && options.forceSelfTopUpdate)
    ) {
      snapshot.newSelfTop = currentSelfTop
    }

    if (Object.keys(snapshot).length === 0 && snapshot.constructor === Object) {
      return snapshot
    }

    return null
  }
  componentDidUpdate(prevProps: tProps, prevState: tState, snapshot?: {}) {
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
        const scrollingUp = scrollTop < prevState.scrollTop
        const reachedSelf = scrollTop >= prevState.selfTop

        if (
          (this.onlyUp && scrollingUp && scrollIsPastTriggerTop) ||
          (!this.onlyUp && scrollIsPastTriggerTop)
        ) {
          position = 'active'
          hasMoved = true
        } else if (
          (!this.triggerIsSelf && reachedSelf) ||
          (this.triggerIsSelf &&
            this.onlyUp &&
            !scrollingUp &&
            scrollIsPastTriggerTop)
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
    const { options, ...attrs } = this.props

    return (
      <Container
        {...attrs}
        innerRef={containerRef => {
          this.ref = containerRef
        }}
        options={{
          ...options,
          selfHeight: this.selfHeight,
          position: this.state.position,
          styles: options ? options.styles || {} : {},
          activeStyles: options ? options.activeStyles || {} : {},
          hiddenStyles: options ? options.hiddenStyles || {} : {},
        }}
      >
        {this.props.children}
      </Container>
    )
  }
}
