type DateStyle = NonNullable<Intl.DateTimeFormatOptions['dateStyle']>

const koDateFormatters = new Map<DateStyle, Intl.DateTimeFormat>()

function getKoDateFormatter(dateStyle: DateStyle): Intl.DateTimeFormat {
  const cachedFormatter = koDateFormatters.get(dateStyle)
  if (cachedFormatter) return cachedFormatter

  const formatter = new Intl.DateTimeFormat('ko-KR', { dateStyle })
  koDateFormatters.set(dateStyle, formatter)
  return formatter
}

export function formatKoDate(value: string | Date, dateStyle: DateStyle = 'medium'): string {
  return getKoDateFormatter(dateStyle).format(new Date(value))
}
