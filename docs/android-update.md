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
# ## 手动配置签名（无脚本）
#
# 1) 生成密钥（仅首次）：
#    mkdir src-tauri\keys
#    keytool -genkeypair -v -keystore src-tauri/keys/cashbook.keystore -alias cashbook -keyalg RSA -keysize 2048 -validity 10000
#
# 2) 在 gen/android 写 keystore.properties（路径用绝对路径更稳，Windows 反斜杠写成 \\）：
#    文件：src-tauri/gen/android/keystore.properties
#    内容示例：
#      storeFile=D:\\program\\CashBook\\src-tauri\\keys\\cashbook.keystore
#      password=你的库密码
#      keyAlias=cashbook
#      keyPassword=你的密钥密码
#
# 3) 改 src-tauri/gen/android/app/build.gradle.kts：
#    - 文件顶部加：
#        import java.util.Properties
#        import java.io.FileInputStream
#    - 在 android { } 里、buildTypes 之前加 signingConfigs（读 keystore.properties）
#    - 在 getByName("release") 里加：
#        signingConfig = signingConfigs.getByName("release")
#
# 注意：gen/android 是生成目录；若重新 tauri android init，需再做第 2、3 步。
# keys/ 已 gitignore，勿提交密钥。
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
# - 签名密钥不变（同一 keystore）
#
# ## 打包
# pnpm tauri android init   # 首次
# pnpm tauri android build
#
# ### Windows + pnpm：Gradle 找不到 tauri
# 若报错 `Command "tauri" not found` / `:app:rustBuildArm64Release`：
# 打开 gen/android/buildSrc/.../BuildTask.kt，把 workingDir 设为
# src-tauri 的上一级（仓库根，有 package.json 的那层），不要用 src-tauri。
# 重新执行 `tauri android init` 后若被覆盖，需再改一次。
#
# ### 图标
# 源图：src-tauri/icons/icon.png（建议 1024x1024）
# 生成各平台图标（含 Android mipmap）：
#   pnpm tauri icon src-tauri/icons/icon.png
# 然后重新打包安装。
#
# ### 检查更新 Failed to fetch
# 原生侧走 tauri-plugin-http（capabilities 需允许更新域名）。
# Nginx 的 Content-Type 应为 application/json（勿写成 appllcation/json）。
# 并建议加：Access-Control-Allow-Origin *
#
# Google Play：REQUEST_INSTALL_PACKAGES 属敏感权限，自托管分发可用；
# 若上架 Play，请确认政策或改走 Play 内更新。
