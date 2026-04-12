import { type FormEvent } from 'react'
import { Navigate, Link } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext'

const inputClass = 'form-input'

export default function EventsPage() {
  const { activeFaculty, eventForm, addEvent, updateEventForm } = useAppContext()

  if (!activeFaculty) {
    return <Navigate to="/faculty/login" replace />
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await addEvent()
  }

  return (
    <div className="space-y-3">
      <form className="panel space-y-3" onSubmit={onSubmit}>
        <h2 className="section-title">Create Event</h2>
        <p className="panel-subtitle">Create a new event entry for students.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="event-student-name">
              Student Name
            </label>
            <input
              id="event-student-name"
              className={inputClass}
              value={eventForm.studentName}
              onChange={(event) => updateEventForm('studentName', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="event-roll">
              Student Roll Number
            </label>
            <input
              id="event-roll"
              className={inputClass}
              value={eventForm.studentRollNumber}
              onChange={(event) => updateEventForm('studentRollNumber', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="event-name">
              Event Name
            </label>
            <input
              id="event-name"
              className={inputClass}
              value={eventForm.eventName}
              onChange={(event) => updateEventForm('eventName', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="event-location">
              Event Location
            </label>
            <input
              id="event-location"
              className={inputClass}
              value={eventForm.eventLocation}
              onChange={(event) => updateEventForm('eventLocation', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="event-date">
              Event Date
            </label>
            <input
              id="event-date"
              type="date"
              className={inputClass}
              value={eventForm.eventDate}
              onChange={(event) => updateEventForm('eventDate', event.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="event-description">
            Event Description
          </label>
          <textarea
            id="event-description"
            className="form-textarea min-h-24 resize-y"
            value={eventForm.eventDescription}
            onChange={(event) => updateEventForm('eventDescription', event.target.value)}
            required
          />
        </div>

        <button className="btn-dark" type="submit">
          Add Event
        </button>
      </form>

      <section className="grid gap-3 md:grid-cols-2">
        <Link to="/events/month" className="utility-card">
          View Month Events
        </Link>
        <Link to="/events/manage" className="utility-card">
          Manage Existing Event
        </Link>
      </section>
    </div>
  )
}
