export interface ClientProfileEducation {
	title: string
	startDate: string
	endDate?: string
	isCurrent?: boolean
}

export interface ClientProfileAward {
	title: string
	desc?: string
	awardedAt: string
}

export interface ClientProfileLink {
	label: string
	href: string
}

export interface ClientProfile {
	heading: string
	paragraphs: string[]
	education: ClientProfileEducation[]
	awards: ClientProfileAward[]
	links: ClientProfileLink[]
}
