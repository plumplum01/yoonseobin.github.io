import { useEffect } from 'react'

type UseMediaPreloadOptions = {
	enabled?: boolean
	images?: Array<string | undefined>
}

export function useMediaPreload({ enabled = true, images = [] }: UseMediaPreloadOptions) {
	useEffect(() => {
		if (!enabled) return

		const urls = images.filter((image): image is string => Boolean(image))

		for (const url of urls) {
			const image = new Image()
			image.src = url
			image.decode().catch(() => {
				/* decode 실패는 무시 — 브라우저 기본 로딩 경로로 fallback */
			})
		}
	}, [enabled, images])
}
