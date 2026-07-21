# Android / 自更新适配说明
#
# ## 版本必须一致
# 发版时同步修改：
# - package.json → version
# - src-tauri/tauri.conf.json → version   （Android versionName 来源）
# - src-tauri/Cargo.toml → version
# - .env → VITE_APP_VERSION               （Web / 构建回退）
#
# 应用内「检查更新」在 Tauri/Android 上优先用 getVersion()，
# 与 tauri.conf.json 的 version 一致，避免前端写死版本与安装包不一致。
#
# ## 签名密钥放在 .env
# 在 .env 中配置（不要提交 .env）：
#   ANDROID_KEYSTORE_PATH=./src-tauri/keys/cashbook.keystore
#   ANDROID_KEYSTORE_PASSWORD=...
#   ANDROID_KEY_ALIAS=cashbook
#   ANDROID_KEY_PASSWORD=...
#
# 打包前执行：
#   pnpm android:signing   # 生成 gen/android/keystore.properties 并注入 Gradle
#   pnpm android:build     # 等价于 signing + tauri android build
#
# ## 远程清单
# 部署 update.json，并在 .env 设置 VITE_UPDATE_MANIFEST_URL：
# {
#   "version": "0.2.0",
#   "url": "https://cdn.example.com/cashbook-0.2.0.apk",
#   "notes": "更新说明"
# }
#
# ## 下载后「自动安装」的真实含义
# Android 禁止第三方应用静默安装。流程是：
# 1. 应用内下载 APK 到 appCacheDir
# 2. 如需要，引导用户开启「允许安装未知应用」
# 3. 自动调起系统安装界面（用户仍需点一次「安装」）
# 安装成功后进程会被替换；下次启动即为新版本。
#
# ## 覆盖安装前提
# - identifier / applicationId 不变（当前：com.cashbook.app）
# - 签名密钥不变（keystore 与密码固定保存在 .env）
#
# ## 打包
# pnpm tauri android init   # 首次
# pnpm android:build
#
# Google Play：REQUEST_INSTALL_PACKAGES 属敏感权限，自托管分发可用；
# 若上架 Play，请确认政策或改走 Play 内更新。
