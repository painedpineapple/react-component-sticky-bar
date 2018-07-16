import styled from 'react-emotion'

export default styled('div')(props => ({
  position: 'relative',

  ...scrollingProps(props),

  ...props.styles,
}))

function scrollingProps(props) {
  const common = {
    position: 'sticky',
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
  }

  switch (props.position) {
    case 'hidden':
      return {
        ...common,
        transform: `translateY(-${props.selfHeight}px)`,

        ...props.disabledStyles,
      }
    case 'ready':
      return {
        ...common,
        transition: 'transform 0.5s ease',
        transform: `translateY(-${props.selfHeight}px)`,

        ...props.readyStyles,
      }
    case 'active': {
      return {
        ...common,
        transition: 'transform 0.5s ease',

        ...props.activeStyles,
      }
    }
    default:
      return {}
  }
}
