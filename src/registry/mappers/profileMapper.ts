import type {
  ClientProfile,
  ClientProfileAward,
  ClientProfileEducation,
  ClientProfileLink,
  Profile,
  ProfileAward,
  ProfileEducation,
  ProfileLink,
} from '@portfolio/types'

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

function validateEducationPayload(item: UnknownRecord, index: number): void {
  const context = `profile.education[${index}]`
  const startDate = requireString(item, 'startDate', context)
  const endDate = optionalString(item, 'endDate')
  const isCurrent = optionalBoolean(item, 'isCurrent')

  if (!isCurrent && !endDate) {
    throw new Error(`Invalid profile payload: ${context}.endDate must be provided`)
  }

  requireString(item, 'title', context)
  formatMonth(startDate)
  if (endDate) formatMonth(endDate)
}

function mapClientEducation(item: ClientProfileEducation): ProfileEducation {
  const isCurrent = item.isCurrent ?? false

  if (!isCurrent && !item.endDate) {
    throw new Error('Invalid profile payload: profile.education[].endDate must be provided')
  }

  return {
    title: item.title,
    startDate: item.startDate,
    ...(item.endDate ? { endDate: item.endDate } : {}),
    isCurrent,
    displayPeriod: isCurrent
      ? `${formatMonth(item.startDate)} – Present`
      : `${formatMonth(item.startDate)} – ${formatMonth(item.endDate!)}`,
  }
}

function validateAwardPayload(item: UnknownRecord, index: number): void {
  const context = `profile.awards[${index}]`
  const awardedAt = requireString(item, 'awardedAt', context)
  requireString(item, 'title', context)
  optionalString(item, 'desc')
  formatMonth(awardedAt)
}

function mapClientAward(item: ClientProfileAward): ProfileAward {
  return {
    title: item.title,
    ...(item.desc ? { desc: item.desc } : {}),
    awardedAt: item.awardedAt,
    displayDate: formatMonth(item.awardedAt),
  }
}

function validateLinkPayload(item: UnknownRecord, index: number): void {
  const context = `profile.links[${index}]`
  requireString(item, 'label', context)
  requireString(item, 'href', context)
}

function mapClientLink(item: ClientProfileLink): ProfileLink {
  return {
    label: item.label,
    href: item.href,
  }
}

export function assertClientProfile(raw: unknown): ClientProfile {
  if (!isRecord(raw)) {
    throw new Error('Invalid profile payload: profile document is missing')
  }

  return {
    heading: requireString(raw, 'heading', 'profile'),
    paragraphs: requireStringArray(raw, 'paragraphs', 'profile'),
    education: requireObjectArray(raw, 'education', 'profile', (item, index) => {
      validateEducationPayload(item, index)
      return item as unknown as ClientProfileEducation
    }),
    awards: requireObjectArray(raw, 'awards', 'profile', (item, index) => {
      validateAwardPayload(item, index)
      return item as unknown as ClientProfileAward
    }),
    links: requireObjectArray(raw, 'links', 'profile', (item, index) => {
      validateLinkPayload(item, index)
      return item as unknown as ClientProfileLink
    }),
  }
}

export function mapClientProfile(clientProfile: ClientProfile): Profile {
  return {
    heading: clientProfile.heading,
    paragraphs: clientProfile.paragraphs,
    education: clientProfile.education.map(mapClientEducation),
    awards: clientProfile.awards.map(mapClientAward),
    links: clientProfile.links.map(mapClientLink),
  }
}

export function mapProfile(raw: unknown): Profile {
  return mapClientProfile(assertClientProfile(raw))
}
