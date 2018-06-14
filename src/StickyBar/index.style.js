import styled from 'react-emotion'

export default styled('div')(({ options: o }) => ({
  position: 'relative',
  top: 0,
  backgroundColor: '#fff',

  ...scrollingProps(o),

  ...o.styles,
}))

function scrollingProps(o) {
  switch (o.position) {
    case 'hidden':
      console.log('hidden')
      return {
        position: 'sticky',
        transition: 'transform 0.5s ease',
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        transform: `translateY(-${o.selfHeight}px)`,
      }
    case 'active': {
      console.log('active')
      return {
        position: 'sticky',
        transition: 'transform 0.5s ease',
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        boxShadow: '1px 1px 16px rgba(0, 0, 0, 0.12)',
      }
    }
    default:
      console.log('default')
      return {}
  }
}
