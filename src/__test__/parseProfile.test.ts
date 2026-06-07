import { parseProfile } from '@/registry/mappers/parseProfile'

const profilePayload = {
	heading: 'Heading',
	paragraphs: ['First paragraph', 'Second paragraph'],
	education: [{ title: 'School', startDate: '2020-03-01', endDate: '2025-02-01' }],
	awards: [{ title: 'Award', desc: 'Description', awardedAt: '2024-12-01' }],
	links: [{ label: 'GitHub', href: 'https://github.com/example' }],
}

describe('parseProfile', () => {
	it('Sanity profile payload를 앱 Profile view model로 변환한다', () => {
		expect(parseProfile(profilePayload)).toEqual({
			heading: 'Heading',
			paragraphs: ['First paragraph', 'Second paragraph'],
			education: [
				{
					title: 'School',
					startDate: '2020-03-01',
					endDate: '2025-02-01',
					isCurrent: false,
					displayPeriod: '20. 03 – 25. 02',
				},
			],
			awards: [
				{
					title: 'Award',
					desc: 'Description',
					awardedAt: '2024-12-01',
					displayDate: '24. 12',
				},
			],
			links: [{ label: 'GitHub', href: 'https://github.com/example' }],
		})
	})

	it('desc가 없는 award도 허용한다', () => {
		const result = parseProfile({
			...profilePayload,
			awards: [{ title: 'Award', awardedAt: '2024-12-01' }],
		})

		expect(result.awards).toEqual([
			{ title: 'Award', awardedAt: '2024-12-01', displayDate: '24. 12' },
		])
	})

	it('현재 진행 중인 education은 endDate 없이 Present 표시를 만든다', () => {
		const result = parseProfile({
			...profilePayload,
			education: [{ title: 'School', startDate: '2020-03-01', isCurrent: true }],
		})

		expect(result.education[0]).toMatchObject({
			startDate: '2020-03-01',
			isCurrent: true,
			displayPeriod: '20. 03 – Present',
		})
	})

	it('profile 문서가 없으면 실패한다', () => {
		expect(() => parseProfile(null)).toThrow('profile document is missing')
	})

	it('필수 string 필드가 비어 있으면 실패한다', () => {
		expect(() => parseProfile({ ...profilePayload, heading: '' })).toThrow(
			'profile.heading must be a non-empty string',
		)
	})

	it('반복 object 배열이 아니면 실패한다', () => {
		expect(() => parseProfile({ ...profilePayload, education: ['School'] })).toThrow(
			'profile.education must be an object array',
		)
	})

	it('중첩 필수 필드가 없으면 위치를 포함해 실패한다', () => {
		expect(() => parseProfile({ ...profilePayload, links: [{ label: 'GitHub' }] })).toThrow(
			'profile.links[0].href must be a non-empty string',
		)
	})

	it('종료된 education에 endDate가 없으면 실패한다', () => {
		expect(() =>
			parseProfile({
				...profilePayload,
				education: [{ title: 'School', startDate: '2020-03-01' }],
			}),
		).toThrow('profile.education[0].endDate must be provided')
	})

	it('날짜가 YYYY-MM-DD 형식이 아니면 실패한다', () => {
		expect(() =>
			parseProfile({
				...profilePayload,
				awards: [{ title: 'Award', awardedAt: '2024-12' }],
			}),
		).toThrow('profile.awards[0].awardedAt must use YYYY-MM-DD format')
	})
})
