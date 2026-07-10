import { useState } from 'react'
import { Button, Card, Input, Title } from 'animal-island-ui'
import { useCashbook } from '../context/CashbookContext'
import { useAlertDialog } from '../hooks/useAlertDialog'

function CategoryGroup({ title, type, categories, onAdd, onDelete, showAlert }) {
  const [name, setName] = useState('')

  const handleAdd = () => {
    const result = onAdd(name, type)
    if (!result.ok) {
      showAlert(result.message, { title: '无法添加' })
      return
    }

    setName('')
    showAlert(`已添加分类「${name.trim()}」`, {
      title: '设置成功',
      confirmText: '好的',
    })
  }

  return (
    <section className="settings-section">
      <Title size="middle" color="app-teal">
        {title}
      </Title>
      <div className="category-group">
        {categories.map((item) => (
          <Card key={item.id} className="category-row">
            <p className="category-row__name">{item.name}</p>
            <Button size="small" danger onClick={() => onDelete(item.id)}>
              删除
            </Button>
          </Card>
        ))}
      </div>
      <div className="category-add">
        <Input
          placeholder="新分类名称"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button type="primary" onClick={handleAdd}>
          添加
        </Button>
      </div>
    </section>
  )
}

export default function CategoryManager() {
  const { state, addCategory, deleteCategory } = useCashbook()
  const { showAlert, alertDialog } = useAlertDialog()

  const expenseCategories = state.categories.filter((item) => item.type === 'expense')
  const incomeCategories = state.categories.filter((item) => item.type === 'income')

  const handleDelete = (id) => {
    const target = state.categories.find((item) => item.id === id)
    const result = deleteCategory(id)
    if (!result.ok) {
      showAlert(result.message, { title: '无法删除' })
      return
    }

    showAlert(`已删除分类「${target?.name || ''}」`, {
      title: '设置成功',
      confirmText: '好的',
    })
  }

  return (
    <div>
      <CategoryGroup
        title="支出分类"
        type="expense"
        categories={expenseCategories}
        onAdd={addCategory}
        onDelete={handleDelete}
        showAlert={showAlert}
      />
      <CategoryGroup
        title="收入分类"
        type="income"
        categories={incomeCategories}
        onAdd={addCategory}
        onDelete={handleDelete}
        showAlert={showAlert}
      />
      {alertDialog}
    </div>
  )
}
