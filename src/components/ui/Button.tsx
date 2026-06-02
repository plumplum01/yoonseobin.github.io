import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export const buttonVariants = cva(
	'inline-flex shrink-0 cursor-pointer items-center justify-center border-0 text-nav font-medium leading-none tracking-nav transition-colors disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				ghost: 'bg-transparent text-current hover:bg-[var(--ghost-1)]',
				nav: 'rounded-full bg-[var(--nav-btn)] text-[var(--nav-text)] hover:bg-[var(--nav-btn-hover)]',
				panel: 'rounded-full bg-[var(--btn-base)] text-[var(--on-dark)] hover:bg-[var(--btn-hover)]',
			},
			size: {
				sm: 'h-8 px-3',
				md: 'h-10 px-4',
				navItem: 'h-11 w-full px-4',
				icon: 'size-11 p-0',
			},
		},
		defaultVariants: {
			variant: 'ghost',
			size: 'md',
		},
	},
)

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
	return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
