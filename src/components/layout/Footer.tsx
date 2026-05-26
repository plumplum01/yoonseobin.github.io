import { site } from '../../registry/site'
import { cn } from '../../lib/cn'

interface FooterProps {
  variant: 'desktop' | 'mobile'
}

export default function Footer({ variant }: FooterProps) {
  const isMobile = variant === 'mobile'
  const copyrightOrder = isMobile ? 'order-last' : 'order-first'
  const emailOrder = isMobile ? 'order-first' : 'order-last'

  return (
    <footer
      className={cn(
        'text-body font-medium tracking-tight text-[var(--text-footer)]',
        '[&_a]:text-[var(--text-footer)] [&_a]:no-underline [&_a]:text-[0.8rem] [&_a]:font-normal',
        '[&_span]:text-[var(--text-footer)] [&_span]:text-[0.8rem] [&_span]:font-normal',
        isMobile ? 'mt-10 flex flex-col p-3' : 'absolute inset-x-0 bottom-0 flex h-11 px-8 [&>div]:flex-1',
      )}
    >
      <div>
        <span>{site.nameDisplay}</span>
      </div>
      <div className="flex w-full justify-between">
        <span className={copyrightOrder}>ⓒ2026</span>
        <span className={emailOrder}>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </span>
      </div>
    </footer>
  )
}
