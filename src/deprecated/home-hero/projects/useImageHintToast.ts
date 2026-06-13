import { useCallback, useRef, useState } from 'react'

const IMAGE_HINT_STORAGE_KEY = 'image-hint-shown'
const IMAGE_HINT_DURATION_MS = 3000

export function useImageHintToast() {
	const [showToast, setShowToast] = useState(false)
	const observerRef = useRef<IntersectionObserver | null>(null)

	const firstImageRef = useCallback((el: HTMLDivElement | null) => {
		if (observerRef.current) {
			observerRef.current.disconnect()
			observerRef.current = null
		}
		if (!el || sessionStorage.getItem(IMAGE_HINT_STORAGE_KEY)) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					sessionStorage.setItem(IMAGE_HINT_STORAGE_KEY, '1')
					setShowToast(true)
					observer.disconnect()
					observerRef.current = null
					setTimeout(() => setShowToast(false), IMAGE_HINT_DURATION_MS)
				}
			},
			{ threshold: 0.1 },
		)

		observer.observe(el)
		observerRef.current = observer
	}, [])

	return { firstImageRef, showToast }
}
