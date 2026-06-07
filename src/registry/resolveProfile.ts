import { profileQuery } from '@portfolio/sanity/queries'
import type { Profile } from '@portfolio/types'
import { mapProfile } from '@/registry/mappers/mapProfile'
import { getSanityClient } from '@/registry/sanityClient'

export async function resolveProfile(): Promise<Profile> {
	const rawProfile = await getSanityClient().fetch<unknown>(profileQuery)
	return mapProfile(rawProfile)
}
