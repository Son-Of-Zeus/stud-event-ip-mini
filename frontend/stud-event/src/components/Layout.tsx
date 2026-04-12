import { Outlet } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext'

export default function Layout() {
  const { status } = useAppContext()

  return (
    <main className="app-shell">
      <div className="app-container">
        <header className="app-header">
          <p className="app-eyebrow">Student Event Platform</p>
          <h1 className="app-title">Campus Event Portal</h1>
          <p className="app-subtitle">Unified space for faculty and students to access event services.</p>
          {status && <p className="status-note">{status}</p>}
        </header>

        <div className="mt-4 sm:mt-5">
          <Outlet />
        </div>
      </div>
    </main>
  )
}
