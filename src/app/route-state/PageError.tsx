import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return error.statusText || error.data || `Request failed with status ${error.status}`
  }

  return error instanceof Error ? error.message : 'Page failed to load'
}

export default function PageError() {
  const error = useRouteError()

  return (
    <main className="mx-auto box-border min-h-screen w-full max-w-3xl px-6 pt-28 pb-20">
      <p className="text-body font-medium leading-loose tracking-tight text-cjk text-[var(--text-primary)]">
        {getErrorMessage(error)}
      </p>
      <Link
        className="mt-8 inline-flex text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)] hover:underline"
        to="/"
      >
        Back to home
      </Link>
    </main>
  )
}
