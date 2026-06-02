import type { ButtonHTMLAttributes } from 'react'
import { Button } from './button'

export function IconButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
	return <Button size="icon" variant="ghost" {...props} />
}
