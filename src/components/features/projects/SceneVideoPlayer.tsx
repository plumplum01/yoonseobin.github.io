import { useEffect, useRef } from 'react'
import type { SceneVideo } from '@/registry/projects'

export default function SceneVideoPlayer({ video }: { video: SceneVideo }) {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		const el = videoRef.current
		if (!el || !video.delay) return
		el.pause()
		const timer = setTimeout(() => {
			el.play()
		}, video.delay)
		return () => clearTimeout(timer)
	}, [video.delay])

	return <video ref={videoRef} src={video.src} autoPlay={!video.delay} loop muted playsInline />
}
