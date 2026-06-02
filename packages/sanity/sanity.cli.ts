import { defineCliConfig } from 'sanity/cli'
import { getSanityEnv } from './env'

export default defineCliConfig({
	api: {
		projectId: getSanityEnv('SANITY_STUDIO_PROJECT_ID') ?? '',
		dataset: getSanityEnv('SANITY_STUDIO_DATASET') ?? 'production',
	},
	deployment: {
		appId: 'thaqboxe0r5jlne5tilbxwti',
	},
})
