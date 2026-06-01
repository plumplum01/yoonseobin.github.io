import { profileQuery } from '@portfolio/sanity/queries'
import type { Profile } from '@portfolio/types'
import { resolveProfile } from './resolvers/profileResolver'
import { getSanityClient } from './sanityClient'

export async function getProfile(): Promise<Profile> {
  const rawProfile = await getSanityClient().fetch<unknown>(profileQuery)
  return resolveProfile(rawProfile)
}
