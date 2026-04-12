import { type FormEvent } from 'react'
import { Navigate, Link } from 'react-router-dom'

import { formatDate } from '../lib/api'
import { useAppContext } from '../context/useAppContext'

const inputClass = 'form-input'

export default function MonthEventsPage() {
  const { activeFaculty, monthFilter, monthEvents, updateMonthFilter, fetchEventsByMonth } = useAppContext()

  if (!activeFaculty) {
    return <Navigate to="/faculty/login" replace />
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await fetchEventsByMonth()
  }

  return (
    <div className="space-y-3">
      <form className="panel space-y-3" onSubmit={onSubmit}>
        <h2 className="section-title">Month Events</h2>
        <p className="panel-subtitle">Fetch all events for a given year and month.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="month-year">
              Year
            </label>
            <input
              id="month-year"
              type="number"
              className={inputClass}
              value={monthFilter.year}
              onChange={(event) => updateMonthFilter('year', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="month-month">
              Month
            </label>
            <input
              id="month-month"
              type="number"
              min="1"
              max="12"
              className={inputClass}
              value={monthFilter.month}
              onChange={(event) => updateMonthFilter('month', event.target.value)}
              required
            />
          </div>
        </div>

        <button className="btn-dark" type="submit">
          Fetch Month Events
        </button>
      </form>

      <section className="panel">
        <div className="flex items-center justify-between gap-3">
          <h3 className="section-title">Results</h3>
          <Link to="/events/manage" className="text-link">
            Manage Specific Event
          </Link>
        </div>

        <div className="mt-3 space-y-2">
          {monthEvents.length === 0 && <p className="muted-copy">No month events loaded yet.</p>}
          {monthEvents.map((monthEvent) => (
            <article
              key={`${monthEvent.id ?? monthEvent.eventName}-${monthEvent.eventDate}`}
              className="result-card"
            >
              <p className="hover-accent text-base font-semibold text-[var(--deep-olive)]">{monthEvent.eventName}</p>
              <p className="muted-copy text-xs">
                {monthEvent.studentName} ({monthEvent.studentRollNumber})
              </p>
              <p className="muted-copy mt-1 text-xs">
                {formatDate(monthEvent.eventDate)} - {monthEvent.eventLocation}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
