import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(packageDir, '../..')

function readEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {}

  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separatorIndex = line.indexOf('=')
        const key = line.slice(0, separatorIndex).trim()
        const rawValue = line.slice(separatorIndex + 1).trim()
        const value = rawValue.replace(/^['"]|['"]$/g, '')
        return [key, value]
      }),
  )
}

const localEnv = {
  ...readEnvFile(resolve(rootDir, '.env')),
  ...readEnvFile(resolve(rootDir, '.env.local')),
  ...readEnvFile(resolve(packageDir, '.env')),
  ...readEnvFile(resolve(packageDir, '.env.local')),
}

export function getSanityEnv(key: string): string | undefined {
  return process.env[key] ?? localEnv[key]
}
