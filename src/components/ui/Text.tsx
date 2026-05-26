import { cva, type VariantProps } from 'class-variance-authority'
import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export const textVariants = cva('', {
  variants: {
    variant: {
      sectionHeading: 'text-section-heading font-semibold tracking-heading',
      body: 'text-body font-medium leading-loose tracking-tight',
      nav: 'text-nav font-medium leading-none tracking-nav',
      cardTitle: 'text-nav font-semibold tracking-card',
      cardSubtitle: 'text-nav font-medium tracking-card',
      contentTitle: 'text-content-title font-semibold',
      contentLabel: 'text-content-label font-medium leading-base',
      contentMeta: 'text-meta font-medium leading-base',
      contentBody: 'text-content-label leading-body tracking-detail',
      caption: 'text-caption leading-none tracking-caption',
    },
    cjk: {
      true: 'text-cjk',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})

interface TextProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: ElementType
}

export function Text({ as: Comp = 'span', className, variant, cjk, ...props }: TextProps) {
  return <Comp className={cn(textVariants({ variant, cjk }), className)} {...props} />
}
