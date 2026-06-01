export default function PagePending() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-center px-6 pt-5">
      <div className="rounded-sm bg-[var(--nav-open)] px-4 py-2 text-caption font-medium leading-none tracking-caption text-[var(--nav-text-open)] shadow-[0_0_16px_rgba(0,0,0,0.12)]">
        Loading...
      </div>
    </div>
  )
}
