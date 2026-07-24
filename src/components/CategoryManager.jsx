import { useState } from 'react'
import CategoryBrowseScreen from './CategoryBrowseScreen'
import CategoryIcon from './CategoryIcon'
import { useCashbook } from '../context/CashbookContext'
import { useAlertDialog } from '../hooks/useAlertDialog'

export default function CategoryManager() {
  const { state, addCategory, updateCategory, deleteCategory } = useCashbook()
  const { showAlert, alertDialog } = useAlertDialog()
  const [editorType, setEditorType] = useState('')

  return (
    <div className="category-manager">
      <div className="category-entry">
        <button
          type="button"
          className="category-entry__btn category-entry__btn--expense"
          onClick={() => setEditorType('expense')}
        >
          <CategoryIcon name="shopping" size={36} />
          <span className="category-entry__copy">
            <strong>支出分类</strong>
            <span>点按管理</span>
          </span>
          <span className="category-entry__chevron" aria-hidden="true">
            ›
          </span>
        </button>

        <button
          type="button"
          className="category-entry__btn category-entry__btn--income"
          onClick={() => setEditorType('income')}
        >
          <CategoryIcon name="salary" size={36} />
          <span className="category-entry__copy">
            <strong>收入分类</strong>
            <span>点按管理</span>
          </span>
          <span className="category-entry__chevron" aria-hidden="true">
            ›
          </span>
        </button>
      </div>

      <CategoryBrowseScreen
        open={editorType === 'expense'}
        type="expense"
        title="支出分类"
        mode="manage"
        categories={state.categories}
        onClose={() => setEditorType('')}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
        showAlert={showAlert}
      />

      <CategoryBrowseScreen
        open={editorType === 'income'}
        type="income"
        title="收入分类"
        mode="manage"
        categories={state.categories}
        onClose={() => setEditorType('')}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
        showAlert={showAlert}
      />

      {alertDialog}
    </div>
  )
}
