import styled from 'react-emotion'

export default styled('div')(({ options: o }) => ({
  ...pastTriggerProps(o),

  ...o.styles,
}))

function pastTriggerProps(o) {
  return o.scrollIsPastTrigger
    ? {
        position: 'sticky',
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        boxShadow: '1px 1px 16px rgba(0, 0, 0, 0.12)',
        backgroundColor: '#fff',
      }
    : {}
}
