import type { ButtonHTMLAttributes } from 'react'
import { Button } from '@/components/ui/button'

export function IconButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
	return <Button size="icon" variant="ghost" {...props} />
}
