import { profileQuery } from '@portfolio/sanity/queries'
import type { Profile } from '@portfolio/types'
import { mapProfile } from './mappers/profileMapper'
import { getSanityClient } from './sanityClient'

export async function loadProfile(): Promise<Profile> {
  const rawProfile = await getSanityClient().fetch<unknown>(profileQuery)
  return mapProfile(rawProfile)
}
