import { Link, Navigate } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext'

export default function StudentHomePage() {
  const { activeStudent, logoutStudent } = useAppContext()

  if (!activeStudent) {
    return <Navigate to="/student/login" replace />
  }

  return (
    <section className="space-y-3">
      <div className="panel panel-soft">
        <p className="kicker">Student Dashboard</p>
        <h2 className="panel-title mt-2">Welcome, {activeStudent.studentName}</h2>
        <p className="panel-subtitle">Choose a task below.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Link to="/student/events" className="option-card">
          <h3 className="section-title hover-accent">My Events</h3>
          <p className="panel-subtitle">Fetch and review your assigned events.</p>
        </Link>

        <Link to="/" className="option-card">
          <h3 className="section-title hover-accent">Switch Role</h3>
          <p className="panel-subtitle">Go back to landing page and choose another portal.</p>
        </Link>
      </div>

      <button
        className="btn-sage"
        type="button"
        onClick={logoutStudent}
      >
        Logout
      </button>
    </section>
  )
}
