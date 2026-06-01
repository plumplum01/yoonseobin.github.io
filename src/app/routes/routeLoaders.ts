import type { LoaderFunctionArgs } from 'react-router-dom'
import { AppRouteError } from '../errors/AppRouteError'
import { loadProfile } from '../../registry/profile'
import { loadPost, loadPosts } from '../../registry/posts'

function isMissingDocumentError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('document is missing')
}

function isInvalidPayloadError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith('Invalid ')
}

function toContentRouteError(error: unknown, message: string): AppRouteError {
  if (isInvalidPayloadError(error)) {
    return new AppRouteError('contentInvalid', message, { cause: error })
  }

  return new AppRouteError('contentUnavailable', message, { cause: error })
}

export async function profileLoader() {
  try {
    return await loadProfile()
  } catch (error) {
    throw toContentRouteError(error, 'Profile failed to load')
  }
}

export async function postsLoader() {
  try {
    return await loadPosts()
  } catch (error) {
    throw toContentRouteError(error, 'Posts failed to load')
  }
}

export async function postDetailLoader({ params }: LoaderFunctionArgs) {
  if (!params.slug) {
    throw new AppRouteError('notFound', 'Post slug is missing')
  }

  try {
    return await loadPost(params.slug)
  } catch (error) {
    if (isMissingDocumentError(error)) {
      throw new AppRouteError('notFound', 'Post document is missing', { cause: error })
    }

    throw toContentRouteError(error, 'Post failed to load')
  }
}
