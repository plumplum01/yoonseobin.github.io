import { createPortfolioSanityClient } from '@portfolio/sanity/client'

const defaultSanityConfig = {
  projectId: 'vetx6ewl',
  dataset: 'production',
  apiVersion: '2026-06-01',
} as const

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required Sanity environment variable: ${name}`)
  }
  return value
}

export function getSanityClient() {
  return createPortfolioSanityClient({
    projectId: requireEnv(
      'VITE_SANITY_PROJECT_ID',
      import.meta.env.VITE_SANITY_PROJECT_ID ?? defaultSanityConfig.projectId,
    ),
    dataset: requireEnv(
      'VITE_SANITY_DATASET',
      import.meta.env.VITE_SANITY_DATASET ?? defaultSanityConfig.dataset,
    ),
    apiVersion: requireEnv(
      'VITE_SANITY_API_VERSION',
      import.meta.env.VITE_SANITY_API_VERSION ?? defaultSanityConfig.apiVersion,
    ),
    useCdn: import.meta.env.VITE_SANITY_USE_CDN !== 'false',
  })
}
