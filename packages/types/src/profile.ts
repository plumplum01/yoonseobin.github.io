export interface ProfileEducation {
	title: string
	startDate: string
	endDate?: string
	isCurrent: boolean
	displayPeriod: string
}

export interface ProfileAward {
	title: string
	desc?: string
	awardedAt: string
	displayDate: string
}

export interface ProfileLink {
	label: string
	href: string
}

export interface Profile {
	heading: string
	paragraphs: string[]
	education: ProfileEducation[]
	awards: ProfileAward[]
	links: ProfileLink[]
}
