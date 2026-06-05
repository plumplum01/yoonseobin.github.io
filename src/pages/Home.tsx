import AboutSection from '@/components/features/home/AboutSection'
import ContactSection from '@/components/features/home/ContactSection'
import Hero from '@/components/features/home/hero'

type Props = {
	smoothScrollEnabled: boolean
}

export default function Home({ smoothScrollEnabled }: Props) {
	return (
		<>
			<Hero smoothScrollEnabled={smoothScrollEnabled} />
			<AboutSection />
			<ContactSection />
		</>
	)
}
