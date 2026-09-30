import { Link } from 'react-router-dom'
import { isInternal, route } from '../lib/site.js'

// Lien unique du site : routeur pour les pages internes, <a> sinon.
export default function A({ href = '#', children, ...rest }) {
  const to = route(href)
  if (isInternal(to)) {
    return (
      <Link to={to} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={to} {...rest}>
      {children}
    </a>
  )
}
