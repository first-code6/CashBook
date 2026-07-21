import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function loadEnvFile(filePath, target) {
  if (!fs.existsSync(filePath)) return
  const text = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in target)) target[key] = value
  }
}

function resolveFromRoot(maybePath) {
  if (!maybePath) return ''
  return path.isAbsolute(maybePath)
    ? path.normalize(maybePath)
    : path.resolve(root, maybePath)
}

/** Java properties 需要把 Windows 反斜杠写成 \\ */
function toPropertiesPath(absolutePath) {
  return absolutePath.replace(/\\/g, '\\\\')
}

const env = { ...process.env }
loadEnvFile(path.join(root, '.env.local'), env)
loadEnvFile(path.join(root, '.env'), env)

const storeFile = resolveFromRoot(env.ANDROID_KEYSTORE_PATH || '')
const password = env.ANDROID_KEYSTORE_PASSWORD || ''
const keyAlias = env.ANDROID_KEY_ALIAS || ''
const keyPassword = env.ANDROID_KEY_PASSWORD || password

const androidRoot = path.join(root, 'src-tauri', 'gen', 'android')
const appGradle = path.join(androidRoot, 'app', 'build.gradle.kts')
const propsFile = path.join(androidRoot, 'keystore.properties')

if (!fs.existsSync(androidRoot)) {
  console.error(
    '[android-signing] 未找到 src-tauri/gen/android。请先执行：pnpm tauri android init',
  )
  process.exit(1)
}

const missing = []
if (!storeFile) missing.push('ANDROID_KEYSTORE_PATH')
if (!password) missing.push('ANDROID_KEYSTORE_PASSWORD')
if (!keyAlias) missing.push('ANDROID_KEY_ALIAS')
if (missing.length) {
  console.error(
    `[android-signing] 缺少环境变量：${missing.join(', ')}（写入 .env 后重试）`,
  )
  process.exit(1)
}

if (!fs.existsSync(storeFile)) {
  console.error(`[android-signing] 找不到密钥文件：${storeFile}`)
  process.exit(1)
}

const props = [
  `storeFile=${toPropertiesPath(storeFile)}`,
  `password=${password}`,
  `keyAlias=${keyAlias}`,
  `keyPassword=${keyPassword}`,
  '',
].join('\n')

fs.writeFileSync(propsFile, props, 'utf8')
console.log(`[android-signing] 已写入 ${path.relative(root, propsFile)}`)

if (!fs.existsSync(appGradle)) {
  console.warn('[android-signing] 未找到 app/build.gradle.kts，跳过 Gradle 签名注入')
  process.exit(0)
}

let gradle = fs.readFileSync(appGradle, 'utf8')
let changed = false

if (!gradle.includes('import java.util.Properties')) {
  gradle = `import java.util.Properties\nimport java.io.FileInputStream\n${gradle}`
  changed = true
} else if (!gradle.includes('import java.io.FileInputStream')) {
  gradle = gradle.replace(
    'import java.util.Properties',
    'import java.util.Properties\nimport java.io.FileInputStream',
  )
  changed = true
}

const signingBlock = `
    signingConfigs {
        create("release") {
            val keystorePropertiesFile = rootProject.file("keystore.properties")
            val keystoreProperties = Properties()
            if (keystorePropertiesFile.exists()) {
                keystoreProperties.load(FileInputStream(keystorePropertiesFile))
            }
            keyAlias = keystoreProperties["keyAlias"] as String
            keyPassword = (keystoreProperties["keyPassword"] ?: keystoreProperties["password"]) as String
            storeFile = file(keystoreProperties["storeFile"] as String)
            storePassword = keystoreProperties["password"] as String
        }
    }
`

if (!gradle.includes('signingConfigs')) {
  if (!/buildTypes\s*\{/.test(gradle)) {
    console.error('[android-signing] build.gradle.kts 中未找到 buildTypes，请手动配置签名')
    process.exit(1)
  }
  gradle = gradle.replace(/buildTypes\s*\{/, `${signingBlock}\n    buildTypes {`)
  changed = true
}

if (!gradle.includes('signingConfigs.getByName("release")')) {
  const releasePat =
    /getByName\(\s*"release"\s*\)\s*\{([\s\S]*?)(?=\n\s*getByName\(|\n\s*\}\s*\n\s*\})/
  if (!releasePat.test(gradle)) {
    console.warn(
      '[android-signing] 未能自动挂到 release buildType，请确认 signingConfig 已手动设置',
    )
  } else {
    gradle = gradle.replace(releasePat, (full, body) => {
      if (body.includes('signingConfig')) return full
      return full.replace(
        /getByName\(\s*"release"\s*\)\s*\{/,
        `getByName("release") {\n            signingConfig = signingConfigs.getByName("release")`,
      )
    })
    changed = true
  }
}

if (changed) {
  fs.writeFileSync(appGradle, gradle, 'utf8')
  console.log(`[android-signing] 已更新 ${path.relative(root, appGradle)}`)
} else {
  console.log('[android-signing] Gradle 签名配置已存在，无需修改')
}

console.log('[android-signing] 完成。可执行：pnpm android:build')
