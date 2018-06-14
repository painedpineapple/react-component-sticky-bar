import styled from 'react-emotion'

export default {
  padding: 20,
  backgroundColor: '#fff',
}

export const hiddenStyles = {}

export const activeStyles = {
  boxShadow: '1px 1px 16px rgba(0, 0, 0, 0.12)',
}

export const P = styled('p')(() => ({
  maxWidth: '800px',
  fontSize: 18,
  margin: 30,
}))
