import { profileQuery } from '@portfolio/sanity/queries'
import type { Profile } from '@portfolio/types'
import { mapProfile } from '@/registry/mappers/profileMapper'
import { getSanityClient } from '@/registry/sanityClient'

export async function loadProfile(): Promise<Profile> {
	const rawProfile = await getSanityClient().fetch<unknown>(profileQuery)
	return mapProfile(rawProfile)
}
