import React from 'react'
//
import Container from './index.style'

type tProps = {
  options: {
    onlyUp: boolean, // only activates when scrolling up, defaults to true
    triggerClass?: string, // if you don't want the sticky aspect to trigger until after a certain element, pass the className used by that element
    styles?: {},
    activeStyles?: {},
    forceTriggerTopUpdate?: boolean,
  },
}

type tState = {
  scrollTop: number,
  position: 'default' | 'hidden' | 'active',
  triggerTop: number,
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
  selfHeight: number
  constructor(props) {
    super(props)

    if (this.props.options.onlyUp !== undefined)
      this.onlyUp = this.props.options.onlyUp
    if (this.props.options.forceTriggerTopUpdate !== undefined)
      this.forceTriggerTopUpdate = this.props.options.forceTriggerTopUpdate

    //     this.ref = React.createRef()
  }
  componentDidMount() {
    if (typeof document !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll, false)

      this.selfHeight = this.ref.offsetHeight

      let triggerTop = 0

      if (this.props.options.triggerClass) {
        this.triggerEl = document.getElementsByClassName(
          this.props.options.triggerClass,
        )[0]

        triggerTop = this.triggerEl.offsetTop
      } else {
        this.triggerIsSelf = true
        this.triggerEl = this.ref
        triggerTop = this.ref.offsetTop
      }

      this.setState({ triggerTop, triggerTopBeforeMoved: triggerTop })
    }
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    let snapshot = {}
    let currentTriggerTop = this.triggerEl.offsetTop

    if (
      (currentTriggerTop !== prevState.triggerTop && !prevState.hasMoved) ||
      (!this.forceTriggerTopUpdate && this.props.options.forceTriggerTopUpdate)
    ) {
      snapshot.newTriggerTop = currentTriggerTop
      return snapshot
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

      this.setState(prevState => {
        let position = prevState.position
        let hasMoved = prevState.hasMoved

        const scrollIsPastTriggerTop = scrollTop >= prevState.triggerTop
        const scrollIsPastTriggerBottom =
          scrollTop >= this.triggerEl.offsetHeight + prevState.triggerTop
        const scrollingUp = scrollTop < prevState.scrollTop
        const pastSelf = scrollTop > this.ref.offsetHeight + this.ref.offsetTop

        // this.triggerIsSelf
        // this.onlyUp
        // prevState.triggerTop
        // prevState.hasMoved

        //         console.log(
        //           'position: ',
        //           this.state.position,
        //           'scrollIsPastTriggerTop',
        //           scrollIsPastTriggerTop,
        //           'onlyUp',
        //           this.onlyUp,
        //         )

        if (
          (this.onlyUp && scrollingUp && scrollIsPastTriggerTop) ||
          (!this.onlyUp && scrollIsPastTriggerTop)
        ) {
          position = 'active'
          hasMoved = true
        } else if (
          (!this.triggerIsSelf && pastSelf) ||
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
        }}
      >
        Hello World
      </Container>
    )
  }
}
