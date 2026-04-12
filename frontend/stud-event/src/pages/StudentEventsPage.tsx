import { type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { formatDate } from '../lib/api'
import { useAppContext } from '../context/useAppContext'

const inputClass = 'form-input'

export default function StudentEventsPage() {
  const {
    activeStudent,
    studentEventsRoll,
    studentEvents,
    setStudentEventsRoll,
    fetchEventsByStudentRoll,
  } = useAppContext()

  if (!activeStudent) {
    return <Navigate to="/student/login" replace />
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await fetchEventsByStudentRoll()
  }

  return (
    <div className="space-y-3">
      <form className="panel space-y-3" onSubmit={onSubmit}>
        <h2 className="section-title">My Events</h2>
        <p className="panel-subtitle">Fetch events for your roll number.</p>

        <div className="max-w-sm">
          <label className="field-label" htmlFor="student-events-roll">
            Roll Number
          </label>
          <input
            id="student-events-roll"
            className={inputClass}
            value={studentEventsRoll}
            onChange={(event) => setStudentEventsRoll(event.target.value)}
            required
          />
        </div>

        <button className="btn-dark" type="submit">
          Fetch My Events
        </button>
      </form>

      <section className="panel">
        <div className="flex items-center justify-between gap-3">
          <h3 className="section-title">Results</h3>
          <Link to="/student/home" className="text-link">
            Back to Dashboard
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {studentEvents.length === 0 && <p className="muted-copy">No student events loaded yet.</p>}
          {studentEvents.map((studentEvent) => (
            <article
              key={`${studentEvent.id ?? studentEvent.eventName}-${studentEvent.eventDate}`}
              className="result-card"
            >
              <p className="hover-accent text-base font-semibold text-[var(--deep-olive)]">{studentEvent.eventName}</p>
              <p className="muted-copy text-xs">
                {formatDate(studentEvent.eventDate)} - {studentEvent.eventLocation}
              </p>
              <p className="muted-copy mt-1 text-xs">Faculty: {studentEvent.facultyId}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
