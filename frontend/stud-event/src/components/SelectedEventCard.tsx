import { formatDate } from '../lib/api'
import { useAppContext } from '../context/useAppContext'

export default function SelectedEventCard() {
  const { selectedEvent } = useAppContext()

  return (
    <div className="panel">
      <h2 className="section-title">Selected Event</h2>
      {!selectedEvent && (
        <p className="muted-copy mt-3">Load or create an event to preview it here.</p>
      )}
      {selectedEvent && (
        <div className="result-card mt-3 space-y-2">
          <p className="hover-accent text-base font-semibold text-[var(--deep-olive)]">{selectedEvent.eventName}</p>
          <p className="muted-copy text-sm">
            Student: {selectedEvent.studentName} ({selectedEvent.studentRollNumber})
          </p>
          <p className="muted-copy text-sm">Date: {formatDate(selectedEvent.eventDate)}</p>
          <p className="muted-copy text-sm">Location: {selectedEvent.eventLocation}</p>
          <p className="muted-copy text-sm">Faculty ID: {selectedEvent.facultyId}</p>
          <p className="muted-copy text-sm">{selectedEvent.eventDescription}</p>
          {selectedEvent.id && <p className="mono-chip">ID: {selectedEvent.id}</p>}
        </div>
      )}
    </div>
  )
}
