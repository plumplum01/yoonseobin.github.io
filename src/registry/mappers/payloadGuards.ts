export type UnknownRecord = Record<string, unknown>

export function isRecord(value: unknown): value is UnknownRecord {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function requirePayloadRecord(value: unknown, missingMessage: string): UnknownRecord {
	if (!isRecord(value)) {
		throw new Error(`Invalid payload: ${missingMessage}`)
	}
	return value
}

export function requireString(record: UnknownRecord, key: string, context: string): string {
	const value = record[key]
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`Invalid payload: ${context}.${key} must be a non-empty string`)
	}
	return value
}

export function requireStringArray(
	record: UnknownRecord,
	key: string,
	context: string,
): string[] {
	const value = record[key]
	if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
		throw new Error(`Invalid payload: ${context}.${key} must be a string array`)
	}
	return value
}

export function optionalString(
	record: UnknownRecord,
	key: string,
	context: string,
): string | undefined {
	const value = record[key]
	if (typeof value === 'undefined' || value === null) return undefined
	if (typeof value !== 'string') {
		throw new Error(`Invalid payload: ${context}.${key} must be a string when provided`)
	}
	return value
}

export function optionalNumber(
	record: UnknownRecord,
	key: string,
	context: string,
): number | undefined {
	const value = record[key]
	if (typeof value === 'undefined' || value === null) return undefined
	if (typeof value !== 'number') {
		throw new Error(`Invalid payload: ${context}.${key} must be a number when provided`)
	}
	return value
}

export function optionalBoolean(
	record: UnknownRecord,
	key: string,
	context: string,
): boolean | undefined {
	const value = record[key]
	if (typeof value === 'undefined' || value === null) return undefined
	if (typeof value !== 'boolean') {
		throw new Error(`Invalid payload: ${context}.${key} must be a boolean when provided`)
	}
	return value
}

export function booleanWithDefault(
	record: UnknownRecord,
	key: string,
	context: string,
	defaultValue: boolean,
): boolean {
	return optionalBoolean(record, key, context) ?? defaultValue
}

export function requireRecord(
	record: UnknownRecord,
	key: string,
	context: string,
): UnknownRecord {
	const value = record[key]
	if (!isRecord(value)) {
		throw new Error(`Invalid payload: ${context}.${key} must be an object`)
	}
	return value
}

export function optionalRecordArray(
	record: UnknownRecord,
	key: string,
	context: string,
): UnknownRecord[] {
	const value = record[key]
	if (value === undefined || value === null) return []
	if (!Array.isArray(value) || value.some((item) => !isRecord(item))) {
		throw new Error(`Invalid payload: ${context}.${key} must be an object array`)
	}
	return value
}

export function requireRecordArray(
	record: UnknownRecord,
	key: string,
	context: string,
): UnknownRecord[] {
	const value = record[key]
	if (!Array.isArray(value) || value.some((item) => !isRecord(item))) {
		throw new Error(`Invalid payload: ${context}.${key} must be an object array`)
	}
	return value
}
