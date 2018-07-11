import styled from 'react-emotion'

export default styled('div')(props => ({
  position: 'relative',

  ...scrollingProps(props),

  ...props.styles,
}))

function scrollingProps(props) {
  switch (props.position) {
    case 'hidden':
      return {
        position: 'sticky',
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        transform: `translateY(-${props.selfHeight}px)`,

        ...props.disabledStyles,
      }
    case 'ready':
      return {
        position: 'sticky',
        transition: 'transform 0.5s ease',
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        transform: `translateY(-${props.selfHeight}px)`,

        ...props.readyStyles,
      }
    case 'active': {
      return {
        position: 'sticky',
        transition: 'transform 0.5s ease',
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,

        ...props.activeStyles,
      }
    }
    default:
      return {}
  }
}
