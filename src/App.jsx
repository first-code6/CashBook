import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Cursor } from 'animal-island-ui'
import Layout from './components/Layout'
import { CashbookProvider } from './context/CashbookContext'
import ChartsPage from './pages/ChartsPage'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <CashbookProvider>
      <BrowserRouter>
        <Cursor />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="charts" element={<ChartsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CashbookProvider>
  )
}
