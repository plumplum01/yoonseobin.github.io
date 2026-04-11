import { useState, useCallback, useEffect } from 'react'
import styles from './SpacingDevPanel.module.css'

interface SpacingConfig {
  variable: string
  label: string
  defaultValue: number
  min: number
  max: number
}

const SPACING_CONFIGS: SpacingConfig[] = [
  { variable: '--cc-info-pt',         label: 'info 상단 패딩',       defaultValue: 18,  min: 0, max: 80  },
  { variable: '--cc-info-pl',         label: 'info 좌측 패딩',       defaultValue: 54,  min: 0, max: 100 },
  { variable: '--cc-info-pl-mobile',  label: 'info 좌측 패딩 (모바일)', defaultValue: 16, min: 0, max: 60  },
  { variable: '--cc-title-pb',        label: '제목↔상세 간격',       defaultValue: 40,  min: 0, max: 120 },
  { variable: '--cc-meta-pb',         label: '상세↔설명 간격',       defaultValue: 40,  min: 0, max: 160 },
  { variable: '--cc-desc-pb',         label: '설명↔탭 간격',         defaultValue: 100, min: 0, max: 200 },
  { variable: '--cc-meta-gap',        label: '상세 라벨 gap',        defaultValue: 12,  min: 0, max: 30  },
  { variable: '--cc-desc-gap',        label: '설명 라벨 gap',        defaultValue: 12,  min: 0, max: 30  },
  { variable: '--cc-meta-grid-gap',   label: '메타 컬럼 gap',        defaultValue: 24,  min: 0, max: 60  },
  { variable: '--cc-toss-mt',         label: 'tossNote margin',      defaultValue: 36,  min: 0, max: 60  },
]

const STORAGE_KEY = 'spacing-dev-panel'

function loadFromStorage(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...getDefaults(), ...JSON.parse(raw) }
  } catch {}
  return getDefaults()
}

function getDefaults(): Record<string, number> {
  return Object.fromEntries(SPACING_CONFIGS.map(c => [c.variable, c.defaultValue]))
}

export default function SpacingDevPanel() {
  const [values, setValues] = useState<Record<string, number>>(loadFromStorage)
  const [copied, setCopied] = useState(false)

  // 마운트 시 저장된 값을 CSS에 적용
  useEffect(() => {
    const saved = loadFromStorage()
    for (const [variable, value] of Object.entries(saved)) {
      if (value !== getDefaults()[variable]) {
        document.documentElement.style.setProperty(variable, `${value}px`)
      }
    }
  }, [])

  const handleChange = useCallback((variable: string, value: number) => {
    setValues(prev => {
      const next = { ...prev, [variable]: value }
      document.documentElement.style.setProperty(variable, `${value}px`)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const handleReset = useCallback(() => {
    const defaults = getDefaults()
    setValues(defaults)
    for (const { variable } of SPACING_CONFIGS) {
      document.documentElement.style.removeProperty(variable)
    }
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  const handleCopy = useCallback(() => {
    const css = SPACING_CONFIGS
      .map(c => `  ${c.variable}: ${values[c.variable]}px;`)
      .join('\n')
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [values])

  return (
    <div className={styles.panel}>
      <div className={styles.header}>Spacing Dev</div>
      <div className={styles.controls}>
        {SPACING_CONFIGS.map(({ variable, label, min, max }) => {
          const value = values[variable]
          return (
            <div key={variable} className={styles.row}>
              <div className={styles.rowLabel}>{label}</div>
              <div className={styles.rowInputs}>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={value}
                  className={styles.slider}
                  onChange={e => handleChange(variable, Number(e.target.value))}
                />
                <input
                  type="number"
                  min={min}
                  max={max}
                  value={value}
                  className={styles.numberInput}
                  onChange={e => handleChange(variable, Number(e.target.value))}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className={styles.actions}>
        <button className={styles.copyBtn} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy CSS'}
        </button>
        <button className={styles.resetBtn} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  )
}
