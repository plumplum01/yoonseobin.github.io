import { createPortfolioSanityClient } from '@portfolio/sanity/client'

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required Sanity environment variable: ${name}`)
  }
  return value
}

export function getSanityClient() {
  return createPortfolioSanityClient({
    projectId: requireEnv('VITE_SANITY_PROJECT_ID', import.meta.env.VITE_SANITY_PROJECT_ID),
    dataset: requireEnv('VITE_SANITY_DATASET', import.meta.env.VITE_SANITY_DATASET),
    apiVersion: requireEnv('VITE_SANITY_API_VERSION', import.meta.env.VITE_SANITY_API_VERSION),
    useCdn: import.meta.env.VITE_SANITY_USE_CDN !== 'false',
  })
}
