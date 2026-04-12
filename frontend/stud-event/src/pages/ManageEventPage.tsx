import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, Link } from 'react-router-dom'

import { formatDate } from '../lib/api'
import { useAppContext } from '../context/useAppContext'
import SelectedEventCard from '../components/SelectedEventCard'

const inputClass = 'form-input'

export default function ManageEventPage() {
  const {
    activeFaculty,
    facultyEvents,
    eventLookup,
    eventForm,
    fetchFacultyEvents,
    selectFacultyEventForManagement,
    updateEventForm,
    updateEvent,
    deleteEvent,
  } = useAppContext()
  const [hasRequestedInitialEvents, setHasRequestedInitialEvents] = useState(false)

  useEffect(() => {
    if (!activeFaculty) {
      return
    }

    setHasRequestedInitialEvents(false)
  }, [activeFaculty?.facultyId])

  useEffect(() => {
    if (!activeFaculty || hasRequestedInitialEvents) {
      return
    }

    setHasRequestedInitialEvents(true)
    void fetchFacultyEvents()
  }, [activeFaculty, hasRequestedInitialEvents, fetchFacultyEvents])

  if (!activeFaculty) {
    return <Navigate to="/faculty/login" replace />
  }

  async function onUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await updateEvent()
  }

  return (
    <div className="space-y-3">
      <section className="panel space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="section-title">Select Event to Manage</h2>
            <p className="panel-subtitle">
              Load all your events, then click one event to auto-select its ID for update or delete.
            </p>
          </div>
          <button className="btn-sage" type="button" onClick={fetchFacultyEvents}>
            Refresh Events
          </button>
        </div>

        <div className="space-y-2">
          {facultyEvents.length === 0 && (
            <p className="muted-copy">No events loaded yet. Click "Refresh Events" to fetch your events.</p>
          )}

          {facultyEvents.map((facultyEvent) => (
            <button
              key={`${facultyEvent.id ?? facultyEvent.eventName}-${facultyEvent.eventDate}`}
              className={`result-card result-card-button ${eventLookup.eventId === facultyEvent.id ? 'is-active' : ''}`}
              type="button"
              onClick={() => selectFacultyEventForManagement(facultyEvent)}
            >
              <p className="hover-accent text-base font-semibold text-[var(--deep-olive)]">{facultyEvent.eventName}</p>
              <p className="muted-copy text-xs">
                {facultyEvent.studentName} ({facultyEvent.studentRollNumber})
              </p>
              <p className="muted-copy mt-1 text-xs">
                {formatDate(facultyEvent.eventDate)} - {facultyEvent.eventLocation}
              </p>
              {facultyEvent.id && <p className="mono-chip mt-2">ID: {facultyEvent.id}</p>}
            </button>
          ))}
        </div>
      </section>

      <form className="panel space-y-3" onSubmit={onUpdateSubmit}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="section-title">Update Selected Event</h3>
          <Link to="/events" className="text-link">
            Back to Create Event
          </Link>
        </div>

        <p className="mono-chip">{eventLookup.eventId ? `ID: ${eventLookup.eventId}` : 'No event selected yet'}</p>

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

        <div className="flex flex-wrap gap-2">
          <button className="btn-dark" type="submit" disabled={!eventLookup.eventId}>
            Update Event
          </button>
          <button className="btn-warm" type="button" onClick={deleteEvent} disabled={!eventLookup.eventId}>
            Delete Event
          </button>
        </div>
      </form>

      <SelectedEventCard />
    </div>
  )
}
