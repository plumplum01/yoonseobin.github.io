import { createClient, type ClientConfig, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export interface PortfolioSanityConfig {
  projectId: string
  dataset: string
  apiVersion: string
  useCdn?: boolean
}

export function createPortfolioSanityClient(
  config: PortfolioSanityConfig,
): SanityClient {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: config.useCdn ?? true,
  } satisfies ClientConfig)
}

export function createImageUrlBuilder(client: SanityClient) {
  return imageUrlBuilder(client)
}

export function imageUrlFor(client: SanityClient, source: SanityImageSource): string {
  return createImageUrlBuilder(client).image(source).auto('format').url()
}
