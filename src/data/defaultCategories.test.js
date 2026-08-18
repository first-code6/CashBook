import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import CategoryIcon from '../components/CategoryIcon'
import {
  CATEGORY_ICON_GROUPS,
  CATEGORY_ICON_LABELS,
  CATEGORY_ICON_OPTIONS,
} from './categoryIcons'
import { DEFAULT_CATEGORIES, inferCategoryIcon } from './defaultCategories'

describe('category icons', () => {
  it('keeps every default category icon available in the picker', () => {
    const available = new Set(CATEGORY_ICON_OPTIONS)
    expect(DEFAULT_CATEGORIES.every((category) => available.has(category.icon))).toBe(true)
  })

  it('offers at least sixty labeled category icons', () => {
    expect(CATEGORY_ICON_OPTIONS.length).toBeGreaterThanOrEqual(60)
    expect(CATEGORY_ICON_OPTIONS.every((icon) => CATEGORY_ICON_LABELS[icon])).toBe(true)
    expect(CATEGORY_ICON_GROUPS.every((group) => group.label && group.icons.length > 0)).toBe(
      true,
    )
    expect(new Set(CATEGORY_ICON_OPTIONS).size).toBe(CATEGORY_ICON_OPTIONS.length)

    const fallback = renderToStaticMarkup(createElement(CategoryIcon, { name: 'other' }))
    expect(
      CATEGORY_ICON_OPTIONS.filter((icon) => icon !== 'other').every(
        (icon) => renderToStaticMarkup(createElement(CategoryIcon, { name: icon })) !== fallback,
      ),
    ).toBe(true)
  })

  it.each([
    ['早餐', 'breakfast'],
    ['水果', 'fruit'],
    ['超市买菜', 'grocery'],
    ['蛋糕甜品', 'dessert'],
    ['咖啡', 'coffee'],
    ['飞机票', 'plane'],
    ['高铁票', 'train'],
    ['共享单车', 'bicycle'],
    ['摩托车', 'motorcycle'],
    ['轮船票', 'ship'],
    ['酒店住宿', 'hotel'],
    ['停车费', 'parking'],
    ['汽车保养', 'repair'],
    ['买衣服', 'clothes'],
    ['宽带网费', 'internet'],
    ['手机话费', 'phone'],
    ['理发', 'haircut'],
    ['电影院', 'movie'],
    ['健身运动', 'sport'],
    ['电子游戏', 'game'],
    ['摄影相机', 'camera'],
    ['宠物用品', 'pet'],
    ['育儿用品', 'baby'],
    ['家庭支出', 'family'],
    ['养老支出', 'elder'],
    ['鲜花', 'flower'],
    ['水电燃气', 'utilities'],
    ['银行卡', 'card'],
    ['兼职副业', 'freelance'],
    ['税费', 'tax'],
    ['储蓄', 'savings'],
    ['公益捐赠', 'charity'],
  ])('infers %s as %s', (name, expected) => {
    expect(inferCategoryIcon('', name)).toBe(expected)
  })
})
