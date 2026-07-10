# 小岛记账

动森风格的个人记账应用。纯前端运行，无需后端与数据库，数据保存在浏览器本地，并支持导出 / 导入 JSON 迁移。

## 功能

- **首页总概括**：按自定义账期统计收入、支出、结余与进度
- **月图**：按账期起止日期展示每日收入与支出
- **历史概括**：从今天回溯到本账期开始日的每日明细
- **账期图表**：支出 / 收入分类占比，支持饼图、环形图、柱状图
- **记一笔**：收入 / 支出、金额、分类、日期、备注
- **分类管理**：内置默认分类，可增删
- **账期设置**：每月开始日可选 1–28 号（避免部分月份没有 29/30/31）
- **数据迁移**：导出 / 导入 JSON 文件
- **响应式**：PC 与手机均可使用

## 技术栈

- React 19 + Vite 8
- JavaScript
- pnpm
- [animal-island-ui](https://github.com/guokaigdg/animal-island-ui)
- react-router-dom
- recharts

## 快速开始

```bash
pnpm install
pnpm dev
```

浏览器打开终端提示的本地地址（默认 `http://localhost:5173/`）。

### 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览构建结果 |
| `pnpm lint` | 代码检查 |

## 数据说明

- 日常数据存储在浏览器 `localStorage`（含备份键）
- 金额以「分」为单位保存，界面按元展示
- 导出文件示例：`cashbook-YYYY-MM-DD.json`
- 导入会覆盖当前全部数据，操作前请确认

### 数据结构（简要）

```js
{
  version: 1,
  settings: { cycleStartDay: 1 }, // 每月账期开始日，1–28
  categories: [{ id, name, type: 'income' | 'expense' }],
  transactions: [{ id, type, amount, categoryId, note, date, createdAt }]
}
```

## 页面结构

| 路由 | 页面 |
|------|------|
| `/` | 首页：总概括 + 月图 |
| `/history` | 历史概括 |
| `/charts` | 账期图表 |
| `/settings` | 账期、分类、导入导出 |

## 目录概览

```text
src/
  components/   # 布局、记账表单、月图、图表等
  context/      # 全局记账状态与持久化
  hooks/        # 账期统计、弹框等
  lib/          # 存储、账期、金额、导入导出
  pages/        # 首页 / 历史 / 图表 / 设置
  styles/       # 全局与响应式样式
```

## 说明

本仓库为独立的 React Web 项目，不包含 Tauri / 原生打包配置。若需做成桌面或 Android 应用，请另建独立工程并引用本前端。
