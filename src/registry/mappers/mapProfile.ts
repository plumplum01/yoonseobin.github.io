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
import {
	mapRequiredRecordArray,
	optionalBoolean as readOptionalBoolean,
	optionalString as readOptionalString,
	requirePayloadRecord,
	requireString as readRequiredString,
	requireStringArray as readRequiredStringArray,
	type UnknownRecord,
} from './payloadGuards'

const PAYLOAD_NAME = 'profile'

function requireString(record: UnknownRecord, key: string, context: string): string {
	return readRequiredString(record, key, context, PAYLOAD_NAME)
}

function requireStringArray(record: UnknownRecord, key: string, context: string): string[] {
	return readRequiredStringArray(record, key, context, PAYLOAD_NAME)
}

function optionalString(record: UnknownRecord, key: string): string | undefined {
	return readOptionalString(record, key, PAYLOAD_NAME)
}

function optionalBoolean(record: UnknownRecord, key: string): boolean {
	return readOptionalBoolean(record, key, PAYLOAD_NAME)
}

function formatMonth(date: string): string {
	const match = date.match(/^(\d{4})-(\d{2})-\d{2}$/)
	if (!match) {
		throw new Error(`Invalid profile payload: date must use YYYY-MM-DD format`)
	}
	return `${match[1].slice(2)}. ${match[2]}`
}

function assertClientEducation(item: UnknownRecord, index: number): ClientProfileEducation {
	const context = `profile.education[${index}]`
	const startDate = requireString(item, 'startDate', context)
	const endDate = optionalString(item, 'endDate')
	const isCurrent = optionalBoolean(item, 'isCurrent')
	const title = requireString(item, 'title', context)

	if (!isCurrent && !endDate) {
		throw new Error(`Invalid profile payload: ${context}.endDate must be provided`)
	}

	formatMonth(startDate)
	if (endDate) formatMonth(endDate)

	return {
		title,
		startDate,
		...(endDate ? { endDate } : {}),
		isCurrent,
	}
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

function assertClientAward(item: UnknownRecord, index: number): ClientProfileAward {
	const context = `profile.awards[${index}]`
	const awardedAt = requireString(item, 'awardedAt', context)
	const title = requireString(item, 'title', context)
	const desc = optionalString(item, 'desc')
	formatMonth(awardedAt)

	return {
		title,
		...(desc ? { desc } : {}),
		awardedAt,
	}
}

function mapClientAward(item: ClientProfileAward): ProfileAward {
	return {
		title: item.title,
		...(item.desc ? { desc: item.desc } : {}),
		awardedAt: item.awardedAt,
		displayDate: formatMonth(item.awardedAt),
	}
}

function assertClientLink(item: UnknownRecord, index: number): ClientProfileLink {
	const context = `profile.links[${index}]`
	return {
		label: requireString(item, 'label', context),
		href: requireString(item, 'href', context),
	}
}

function mapClientLink(item: ClientProfileLink): ProfileLink {
	return {
		label: item.label,
		href: item.href,
	}
}

export function assertClientProfile(raw: unknown): ClientProfile {
	const record = requirePayloadRecord(raw, PAYLOAD_NAME, 'profile document is missing')

	return {
		heading: requireString(record, 'heading', 'profile'),
		paragraphs: requireStringArray(record, 'paragraphs', 'profile'),
		education: mapRequiredRecordArray(
			record,
			'education',
			'profile',
			PAYLOAD_NAME,
			assertClientEducation,
		),
		awards: mapRequiredRecordArray(
			record,
			'awards',
			'profile',
			PAYLOAD_NAME,
			assertClientAward,
		),
		links: mapRequiredRecordArray(record, 'links', 'profile', PAYLOAD_NAME, assertClientLink),
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
