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
  { id: 'exp-food-drink', name: '饮品', type: 'expense', parentId: 'exp-food', icon: 'coffee' },

  // ── 交通 ──
  { id: 'exp-transport', name: '交通', type: 'expense', parentId: null, icon: 'transport' },
  { id: 'exp-transport-metro', name: '地铁', type: 'expense', parentId: 'exp-transport', icon: 'metro' },
  { id: 'exp-transport-bus', name: '公交', type: 'expense', parentId: 'exp-transport', icon: 'bus' },
  { id: 'exp-transport-taxi', name: '打车', type: 'expense', parentId: 'exp-transport', icon: 'taxi' },

  // ── 车辆 ──
  { id: 'exp-vehicle', name: '车辆', type: 'expense', parentId: null, icon: 'car' },
  { id: 'exp-vehicle-fuel', name: '加油', type: 'expense', parentId: 'exp-vehicle', icon: 'fuel' },
  { id: 'exp-vehicle-insurance', name: '保险', type: 'expense', parentId: 'exp-vehicle', icon: 'insurance' },
  { id: 'exp-vehicle-park', name: '停车', type: 'expense', parentId: 'exp-vehicle', icon: 'parking' },
  { id: 'exp-vehicle-repair', name: '保养维修', type: 'expense', parentId: 'exp-vehicle', icon: 'repair' },

  // ── 购物 ──
  { id: 'exp-shopping', name: '购物', type: 'expense', parentId: null, icon: 'shopping' },
  { id: 'exp-shopping-clothes', name: '服饰', type: 'expense', parentId: 'exp-shopping', icon: 'clothes' },
  { id: 'exp-shopping-digital', name: '数码', type: 'expense', parentId: 'exp-shopping', icon: 'phone' },
  { id: 'exp-shopping-daily', name: '日用品', type: 'expense', parentId: 'exp-shopping', icon: 'daily' },

  // ── 娱乐 ──
  { id: 'exp-entertainment', name: '娱乐', type: 'expense', parentId: null, icon: 'fun' },
  { id: 'exp-entertainment-game', name: '游戏', type: 'expense', parentId: 'exp-entertainment', icon: 'fun' },
  { id: 'exp-entertainment-movie', name: '影音', type: 'expense', parentId: 'exp-entertainment', icon: 'movie' },
  { id: 'exp-entertainment-sport', name: '运动', type: 'expense', parentId: 'exp-entertainment', icon: 'sport' },

  // ── 日用 / 住房 / 医疗 ──
  { id: 'exp-daily', name: '日用', type: 'expense', parentId: null, icon: 'daily' },
  { id: 'exp-daily-home', name: '水电燃气', type: 'expense', parentId: 'exp-daily', icon: 'utilities' },
  { id: 'exp-daily-phone', name: '话费网费', type: 'expense', parentId: 'exp-daily', icon: 'phone' },

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
  if (/早餐|早饭|breakfast/.test(key)) return 'breakfast'
  if (/水果|fruit/.test(key)) return 'fruit'
  if (/买菜|菜市场|超市|grocery/.test(key)) return 'grocery'
  if (/甜品|蛋糕|dessert/.test(key)) return 'dessert'
  if (/餐饮|food|吃|餐/.test(key)) return 'food'
  if (/外卖|takeout/.test(key)) return 'takeout'
  if (/堂食|dine|饭店/.test(key)) return 'dine'
  if (/咖啡|coffee|奶茶/.test(key)) return 'coffee'
  if (/零食|snack|饮品|喝/.test(key)) return 'snack'
  if (/地铁|metro|subway/.test(key)) return 'metro'
  if (/公交|bus/.test(key)) return 'bus'
  if (/打车|taxi|出租/.test(key)) return 'taxi'
  if (/飞机|plane|flight|机票/.test(key)) return 'plane'
  if (/火车|高铁|动车|train/.test(key)) return 'train'
  if (/自行车|单车|bicycle|bike/.test(key)) return 'bicycle'
  if (/摩托|motorcycle/.test(key)) return 'motorcycle'
  if (/轮船|船票|ship|ferry/.test(key)) return 'ship'
  if (/旅行|旅游|travel/.test(key)) return 'travel'
  if (/酒店|hotel|住宿/.test(key)) return 'hotel'
  if (/交通|transport/.test(key)) return 'transport'
  if (/加油|fuel|油/.test(key)) return 'fuel'
  if (/保险|insurance/.test(key)) return 'insurance'
  if (/保养|维修|repair/.test(key)) return 'repair'
  if (/停车|车位|parking/.test(key)) return 'parking'
  if (/车|vehicle|car|汽/.test(key)) return 'car'
  if (/服饰|衣服|clothes/.test(key)) return 'clothes'
  if (/网络|宽带|网费|internet|wifi/.test(key)) return 'internet'
  if (/手机|数码|话费|phone/.test(key)) return 'phone'
  if (/理发|剪发|haircut/.test(key)) return 'haircut'
  if (/美妆|美容|beauty/.test(key)) return 'beauty'
  if (/购物|shop|买/.test(key)) return 'shopping'
  if (/电影|影音|movie|影院/.test(key)) return 'movie'
  if (/音乐|music|演唱会/.test(key)) return 'music'
  if (/运动|健身|sport/.test(key)) return 'sport'
  if (/游戏|game|电竞/.test(key)) return 'game'
  if (/摄影|相机|camera/.test(key)) return 'camera'
  if (/娱乐|fun|玩/.test(key)) return 'fun'
  if (/书|阅读|book/.test(key)) return 'book'
  if (/宠物|猫|狗|pet/.test(key)) return 'pet'
  if (/育儿|宝宝|婴儿|baby/.test(key)) return 'baby'
  if (/家庭|家人|family/.test(key)) return 'family'
  if (/养老|老人|长辈|elder/.test(key)) return 'elder'
  if (/鲜花|花店|flower/.test(key)) return 'flower'
  if (/水电燃气|生活缴费|utilities/.test(key)) return 'utilities'
  if (/水费|用水|water/.test(key)) return 'water'
  if (/电费|用电|electricity/.test(key)) return 'electricity'
  if (/日用|daily|生活/.test(key)) return 'daily'
  if (/住房|home|房租|物业/.test(key)) return 'home'
  if (/医疗|medical|药|看病/.test(key)) return 'medical'
  if (/教育|education|学/.test(key)) return 'education'
  if (/公益|慈善|捐赠|charity/.test(key)) return 'charity'
  if (/礼物|gift|红包|人情/.test(key)) return 'gift'
  if (/钱包|wallet/.test(key)) return 'wallet'
  if (/银行卡|信用卡|card/.test(key)) return 'card'
  if (/银行|bank/.test(key)) return 'bank'
  if (/兼职|副业|自由职业|freelance/.test(key)) return 'freelance'
  if (/工作|办公|work/.test(key)) return 'work'
  if (/税费|税款|tax/.test(key)) return 'tax'
  if (/储蓄|存钱|savings?/.test(key)) return 'savings'
  if (/工资|salary|薪|加班/.test(key)) return 'salary'
  if (/奖金|bonus|年终|绩效/.test(key)) return 'bonus'
  if (/理财|invest|投资|利息|基金|股票/.test(key)) return 'invest'
  return 'other'
}
