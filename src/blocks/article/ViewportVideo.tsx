import { type ComponentProps, useEffect, useRef } from 'react'

type ViewportVideoProps = ComponentProps<'video'> & {
	viewportThreshold?: number
}

function pauseVideo(video: HTMLVideoElement) {
	if (!video.paused) video.pause()
}

export function ViewportVideo({
	muted = true,
	playsInline = true,
	preload = 'metadata',
	viewportThreshold = 0.35,
	...props
}: ViewportVideoProps) {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		const video = videoRef.current
		if (!video) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) return

				if (entry.isIntersecting) {
					video.play().catch(() => undefined)
					return
				}

				pauseVideo(video)
			},
			{ threshold: viewportThreshold },
		)

		observer.observe(video)

		return () => {
			observer.disconnect()
			pauseVideo(video)
		}
	}, [viewportThreshold])

	return (
		<video
			ref={videoRef}
			muted={muted}
			playsInline={playsInline}
			preload={preload}
			{...props}
		/>
	)
}
