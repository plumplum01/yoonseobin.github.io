import { Link, useRouteError } from 'react-router-dom'
import { getRouteErrorView } from '../routes/routeErrors'

export default function PageError() {
  const error = useRouteError()
  const { title, message, backTo, backLabel } = getRouteErrorView(error)

  return (
    <main className="mx-auto box-border min-h-screen w-full max-w-3xl px-6 pt-28 pb-20">
      <h1 className="text-section-heading font-semibold leading-tight tracking-heading text-cjk text-[var(--text-primary)]">
        {title}
      </h1>
      <p className="mt-5 text-body font-medium leading-loose tracking-tight text-cjk text-[var(--caption-gray)]">
        {message}
      </p>
      <Link
        className="mt-8 inline-flex text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)] hover:underline"
        to={backTo}
      >
        {backLabel}
      </Link>
    </main>
  )
}
