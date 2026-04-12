import { Link, Navigate } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext'

export default function FacultyHomePage() {
  const { activeFaculty, logoutFaculty } = useAppContext()

  if (!activeFaculty) {
    return <Navigate to="/faculty/login" replace />
  }

  return (
    <section className="space-y-3">
      <div className="panel panel-soft">
        <p className="kicker">Faculty Dashboard</p>
        <h2 className="panel-title mt-2">Welcome, {activeFaculty.facultyName}</h2>
        <p className="panel-subtitle">Choose a task below.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Link to="/events/create" className="option-card">
          <h3 className="section-title hover-accent">Create Event</h3>
          <p className="panel-subtitle">Add a new event entry.</p>
        </Link>

        <Link to="/events/month" className="option-card">
          <h3 className="section-title hover-accent">Month Events</h3>
          <p className="panel-subtitle">List events for a selected month.</p>
        </Link>

        <Link to="/events/manage" className="option-card">
          <h3 className="section-title hover-accent">Manage Event</h3>
          <p className="panel-subtitle">Select from event list, then update or delete.</p>
        </Link>
      </div>

      <button
        className="btn-sage"
        type="button"
        onClick={logoutFaculty}
      >
        Logout
      </button>
    </section>
  )
}
