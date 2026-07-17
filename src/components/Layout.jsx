import { NavLink, Outlet } from 'react-router-dom'
import { Button } from 'animal-island-ui'

const NAV = [
  { to: '/', label: '首页', end: true },
  { to: '/history', label: '月图' },
  { to: '/charts', label: '图表' },
  { to: '/settings', label: '设置' },
]

function NavButton({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
      }
    >
      {({ isActive }) => (
        <Button type={isActive ? 'primary' : 'default'} block size="small">
          {children}
        </Button>
      )}
    </NavLink>
  )
}

export default function Layout() {
  return (
    <div className="app-shell">
      <div className="app-shell__bg" aria-hidden="true" />

      <div className="app-shell__frame">
        <main className="app-main">
          <Outlet />
        </main>

        <nav className="app-nav" aria-label="主导航">
          {NAV.map((item) => (
            <NavButton key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavButton>
          ))}
        </nav>
      </div>
    </div>
  )
}
