import type { Profile, ProfileAward, ProfileEducation, ProfileLink } from '@portfolio/types'
import {
	booleanWithDefault,
	optionalString,
	requirePayloadRecord,
	requireRecordArray,
	requireString,
	requireStringArray,
	type UnknownRecord,
} from './payloadGuards'

function formatMonth(date: string, context: string): string {
	const match = date.match(/^(\d{4})-(\d{2})-\d{2}$/)
	if (!match) {
		throw new Error(`Invalid payload: ${context} must use YYYY-MM-DD format`)
	}
	return `${match[1].slice(2)}. ${match[2]}`
}

function parseEducation(item: UnknownRecord, index: number): ProfileEducation {
	const context = `profile.education[${index}]`
	const title = requireString(item, 'title', context)
	const startDate = requireString(item, 'startDate', context)
	const endDate = optionalString(item, 'endDate', context)
	const isCurrent = booleanWithDefault(item, 'isCurrent', context, false)

	if (!isCurrent && !endDate) {
		throw new Error(`Invalid payload: ${context}.endDate must be provided`)
	}

	const startLabel = formatMonth(startDate, `${context}.startDate`)
	const displayPeriod = isCurrent
		? `${startLabel} – Present`
		: `${startLabel} – ${formatMonth(endDate!, `${context}.endDate`)}`

	return {
		title,
		startDate,
		...(endDate ? { endDate } : {}),
		isCurrent,
		displayPeriod,
	}
}

function parseAward(item: UnknownRecord, index: number): ProfileAward {
	const context = `profile.awards[${index}]`
	const title = requireString(item, 'title', context)
	const awardedAt = requireString(item, 'awardedAt', context)
	const desc = optionalString(item, 'desc', context)

	return {
		title,
		...(desc ? { desc } : {}),
		awardedAt,
		displayDate: formatMonth(awardedAt, `${context}.awardedAt`),
	}
}

function parseLink(item: UnknownRecord, index: number): ProfileLink {
	const context = `profile.links[${index}]`
	return {
		label: requireString(item, 'label', context),
		href: requireString(item, 'href', context),
	}
}

export function parseProfile(raw: unknown): Profile {
	const record = requirePayloadRecord(raw, 'profile document is missing')
	const context = 'profile'

	return {
		heading: requireString(record, 'heading', context),
		paragraphs: requireStringArray(record, 'paragraphs', context),
		education: requireRecordArray(record, 'education', context).map(parseEducation),
		awards: requireRecordArray(record, 'awards', context).map(parseAward),
		links: requireRecordArray(record, 'links', context).map(parseLink),
	}
}
