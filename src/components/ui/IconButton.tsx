import type { ButtonHTMLAttributes } from 'react'
import { Button } from './Button'

export function IconButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
	return <Button size="icon" variant="ghost" {...props} />
}
