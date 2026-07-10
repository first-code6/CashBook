import { NavLink, Outlet } from 'react-router-dom'
import { Button, Card, Time, Title } from 'animal-island-ui'

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
        <Button type={isActive ? 'primary' : 'default'} block>
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
        <header className="app-header">
          <Card color="app-teal" pattern="default" className="app-header__card">
            <div className="app-header__row">
              <div className="app-header__brand">
                <Title size="large" color="app-green">
                  小岛记账
                </Title>
                <p className="app-header__subtitle">
                  大胆记账，账期一目了然
                </p>
              </div>
              <div className="app-header__time">
                <Time />
              </div>
            </div>
          </Card>
        </header>

        <nav className="app-nav" aria-label="主导航">
          <NavButton to="/" end>
            首页
          </NavButton>
          <NavButton to="/history">历史</NavButton>
          <NavButton to="/charts">图表</NavButton>
          <NavButton to="/settings">设置</NavButton>
        </nav>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
