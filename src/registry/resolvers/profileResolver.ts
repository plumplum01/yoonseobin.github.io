import type { Profile, ProfileAward, ProfileEducation, ProfileLink } from '@portfolio/types'

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireString(record: UnknownRecord, key: string, context: string): string {
  const value = record[key]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Invalid profile payload: ${context}.${key} must be a non-empty string`)
  }
  return value
}

function requireStringArray(record: UnknownRecord, key: string, context: string): string[] {
  const value = record[key]
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`Invalid profile payload: ${context}.${key} must be a string array`)
  }
  return value
}

function optionalString(record: UnknownRecord, key: string): string | undefined {
  const value = record[key]
  if (typeof value === 'undefined' || value === null) return undefined
  if (typeof value !== 'string') {
    throw new Error(`Invalid profile payload: ${key} must be a string when provided`)
  }
  return value
}

function optionalBoolean(record: UnknownRecord, key: string): boolean {
  const value = record[key]
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid profile payload: ${key} must be a boolean when provided`)
  }
  return value
}

function formatMonth(date: string): string {
  const match = date.match(/^(\d{4})-(\d{2})-\d{2}$/)
  if (!match) {
    throw new Error(`Invalid profile payload: date must use YYYY-MM-DD format`)
  }
  return `${match[1].slice(2)}. ${match[2]}`
}

function requireObjectArray<T>(
  record: UnknownRecord,
  key: string,
  context: string,
  resolveItem: (item: UnknownRecord, index: number) => T,
): T[] {
  const value = record[key]
  if (!Array.isArray(value) || value.some((item) => !isRecord(item))) {
    throw new Error(`Invalid profile payload: ${context}.${key} must be an object array`)
  }
  return value.map((item, index) => resolveItem(item, index))
}

function resolveEducation(item: UnknownRecord, index: number): ProfileEducation {
  const context = `profile.education[${index}]`
  const startDate = requireString(item, 'startDate', context)
  const endDate = optionalString(item, 'endDate')
  const isCurrent = optionalBoolean(item, 'isCurrent')

  if (!isCurrent && !endDate) {
    throw new Error(`Invalid profile payload: ${context}.endDate must be provided`)
  }

  return {
    title: requireString(item, 'title', context),
    startDate,
    ...(endDate ? { endDate } : {}),
    isCurrent,
    displayPeriod: isCurrent
      ? `${formatMonth(startDate)} – Present`
      : `${formatMonth(startDate)} – ${formatMonth(endDate!)}`,
  }
}

function resolveAward(item: UnknownRecord, index: number): ProfileAward {
  const context = `profile.awards[${index}]`
  const desc = optionalString(item, 'desc')
  const awardedAt = requireString(item, 'awardedAt', context)
  return {
    title: requireString(item, 'title', context),
    ...(desc ? { desc } : {}),
    awardedAt,
    displayDate: formatMonth(awardedAt),
  }
}

function resolveLink(item: UnknownRecord, index: number): ProfileLink {
  const context = `profile.links[${index}]`
  return {
    label: requireString(item, 'label', context),
    href: requireString(item, 'href', context),
  }
}

export function resolveProfile(raw: unknown): Profile {
  if (!isRecord(raw)) {
    throw new Error('Invalid profile payload: profile document is missing')
  }

  return {
    heading: requireString(raw, 'heading', 'profile'),
    paragraphs: requireStringArray(raw, 'paragraphs', 'profile'),
    education: requireObjectArray(raw, 'education', 'profile', resolveEducation),
    awards: requireObjectArray(raw, 'awards', 'profile', resolveAward),
    links: requireObjectArray(raw, 'links', 'profile', resolveLink),
  }
}
