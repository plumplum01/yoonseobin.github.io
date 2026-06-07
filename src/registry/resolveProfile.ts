import { profileQuery } from '@portfolio/sanity/queries'
import type { Profile } from '@portfolio/types'
import { parseProfile } from '@/registry/mappers/parseProfile'
import { getSanityClient } from '@/registry/sanityClient'

export async function resolveProfile(): Promise<Profile> {
	const rawProfile = await getSanityClient().fetch<unknown>(profileQuery)
	return parseProfile(rawProfile)
}
