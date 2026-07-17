/** @typedef {'expense' | 'income'} CategoryType */

/**
 * @typedef {object} Category
 * @property {string} id
 * @property {string} name
 * @property {CategoryType} type
 * @property {string | null} parentId
 * @property {string} icon
 */

/** @type {Category[]} */
export const DEFAULT_CATEGORIES = [
  // ── 餐饮 ──
  { id: 'exp-food', name: '餐饮', type: 'expense', parentId: null, icon: 'food' },
  { id: 'exp-food-takeout', name: '外卖', type: 'expense', parentId: 'exp-food', icon: 'takeout' },
  { id: 'exp-food-dine', name: '堂食', type: 'expense', parentId: 'exp-food', icon: 'dine' },
  { id: 'exp-food-snack', name: '零食', type: 'expense', parentId: 'exp-food', icon: 'snack' },
  { id: 'exp-food-drink', name: '饮品', type: 'expense', parentId: 'exp-food', icon: 'dine' },

  // ── 交通 ──
  { id: 'exp-transport', name: '交通', type: 'expense', parentId: null, icon: 'transport' },
  { id: 'exp-transport-metro', name: '地铁', type: 'expense', parentId: 'exp-transport', icon: 'metro' },
  { id: 'exp-transport-bus', name: '公交', type: 'expense', parentId: 'exp-transport', icon: 'bus' },
  { id: 'exp-transport-taxi', name: '打车', type: 'expense', parentId: 'exp-transport', icon: 'taxi' },

  // ── 车辆 ──
  { id: 'exp-vehicle', name: '车辆', type: 'expense', parentId: null, icon: 'car' },
  { id: 'exp-vehicle-fuel', name: '加油', type: 'expense', parentId: 'exp-vehicle', icon: 'fuel' },
  { id: 'exp-vehicle-insurance', name: '保险', type: 'expense', parentId: 'exp-vehicle', icon: 'insurance' },
  { id: 'exp-vehicle-park', name: '停车', type: 'expense', parentId: 'exp-vehicle', icon: 'car' },
  { id: 'exp-vehicle-repair', name: '保养维修', type: 'expense', parentId: 'exp-vehicle', icon: 'daily' },

  // ── 购物 ──
  { id: 'exp-shopping', name: '购物', type: 'expense', parentId: null, icon: 'shopping' },
  { id: 'exp-shopping-clothes', name: '服饰', type: 'expense', parentId: 'exp-shopping', icon: 'shopping' },
  { id: 'exp-shopping-digital', name: '数码', type: 'expense', parentId: 'exp-shopping', icon: 'fun' },
  { id: 'exp-shopping-daily', name: '日用品', type: 'expense', parentId: 'exp-shopping', icon: 'daily' },

  // ── 娱乐 ──
  { id: 'exp-entertainment', name: '娱乐', type: 'expense', parentId: null, icon: 'fun' },
  { id: 'exp-entertainment-game', name: '游戏', type: 'expense', parentId: 'exp-entertainment', icon: 'fun' },
  { id: 'exp-entertainment-movie', name: '影音', type: 'expense', parentId: 'exp-entertainment', icon: 'gift' },
  { id: 'exp-entertainment-sport', name: '运动', type: 'expense', parentId: 'exp-entertainment', icon: 'daily' },

  // ── 日用 / 住房 / 医疗 ──
  { id: 'exp-daily', name: '日用', type: 'expense', parentId: null, icon: 'daily' },
  { id: 'exp-daily-home', name: '水电燃气', type: 'expense', parentId: 'exp-daily', icon: 'home' },
  { id: 'exp-daily-phone', name: '话费网费', type: 'expense', parentId: 'exp-daily', icon: 'daily' },

  { id: 'exp-home', name: '住房', type: 'expense', parentId: null, icon: 'home' },
  { id: 'exp-home-rent', name: '房租', type: 'expense', parentId: 'exp-home', icon: 'home' },
  { id: 'exp-home-property', name: '物业', type: 'expense', parentId: 'exp-home', icon: 'daily' },

  { id: 'exp-medical', name: '医疗', type: 'expense', parentId: null, icon: 'medical' },
  { id: 'exp-medical-clinic', name: '看病', type: 'expense', parentId: 'exp-medical', icon: 'medical' },
  { id: 'exp-medical-medicine', name: '买药', type: 'expense', parentId: 'exp-medical', icon: 'medical' },

  { id: 'exp-other', name: '其他支出', type: 'expense', parentId: null, icon: 'other' },
  { id: 'exp-other-gift', name: '人情礼物', type: 'expense', parentId: 'exp-other', icon: 'gift' },
  { id: 'exp-other-misc', name: '杂项', type: 'expense', parentId: 'exp-other', icon: 'other' },

  // ── 收入 ──
  { id: 'inc-salary', name: '工资', type: 'income', parentId: null, icon: 'salary' },
  { id: 'inc-salary-base', name: '基本工资', type: 'income', parentId: 'inc-salary', icon: 'salary' },
  { id: 'inc-salary-overtime', name: '加班费', type: 'income', parentId: 'inc-salary', icon: 'salary' },

  { id: 'inc-bonus', name: '奖金', type: 'income', parentId: null, icon: 'bonus' },
  { id: 'inc-bonus-year', name: '年终奖', type: 'income', parentId: 'inc-bonus', icon: 'bonus' },
  { id: 'inc-bonus-perf', name: '绩效', type: 'income', parentId: 'inc-bonus', icon: 'bonus' },

  { id: 'inc-invest', name: '理财', type: 'income', parentId: null, icon: 'invest' },
  { id: 'inc-invest-interest', name: '利息分红', type: 'income', parentId: 'inc-invest', icon: 'invest' },
  { id: 'inc-invest-fund', name: '基金股票', type: 'income', parentId: 'inc-invest', icon: 'invest' },

  { id: 'inc-other', name: '其他收入', type: 'income', parentId: null, icon: 'other' },
  { id: 'inc-other-gift', name: '红包礼物', type: 'income', parentId: 'inc-other', icon: 'gift' },
  { id: 'inc-other-refund', name: '退款', type: 'income', parentId: 'inc-other', icon: 'other' },
]

/** Infer a cute icon key from legacy id / name. */
export function inferCategoryIcon(id = '', name = '') {
  const key = `${id} ${name}`.toLowerCase()
  if (/餐饮|food|吃|餐/.test(key)) return 'food'
  if (/外卖|takeout/.test(key)) return 'takeout'
  if (/堂食|dine|饭店/.test(key)) return 'dine'
  if (/零食|snack|饮品|喝/.test(key)) return 'snack'
  if (/地铁|metro|subway/.test(key)) return 'metro'
  if (/公交|bus/.test(key)) return 'bus'
  if (/打车|taxi|出租/.test(key)) return 'taxi'
  if (/交通|transport/.test(key)) return 'transport'
  if (/加油|fuel|油/.test(key)) return 'fuel'
  if (/保险|insurance/.test(key)) return 'insurance'
  if (/停车|保养|维修|车|vehicle|car|汽/.test(key)) return 'car'
  if (/购物|shop|买|服饰|数码/.test(key)) return 'shopping'
  if (/娱乐|fun|玩|游戏|影音|运动/.test(key)) return 'fun'
  if (/日用|daily|生活|话费|网费/.test(key)) return 'daily'
  if (/住房|home|房租|水电|燃气|物业/.test(key)) return 'home'
  if (/医疗|medical|药|看病/.test(key)) return 'medical'
  if (/教育|education|学/.test(key)) return 'education'
  if (/礼物|gift|红包|人情/.test(key)) return 'gift'
  if (/工资|salary|薪|加班/.test(key)) return 'salary'
  if (/奖金|bonus|年终|绩效/.test(key)) return 'bonus'
  if (/理财|invest|投资|利息|基金|股票/.test(key)) return 'invest'
  return 'other'
}
