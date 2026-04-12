import { useState, type ReactNode } from 'react'

import { apiBases, getErrorMessage, requestJson } from '../lib/api'
import type {
  EventModel,
  FacultyAuthResponse,
  FacultySession,
  StudentAuthResponse,
  StudentSession,
} from '../types/models'
import {
  AppContext,
  type Credentials,
  type EventForm,
  type EventLookup,
  type FacultyForm,
  type MonthFilter,
  type StudentForm,
} from './AppContextStore'

function normalizeDateForInput(value: string) {
  if (value.includes('T')) {
    return value.slice(0, 10)
  }
  return value
}

function buildAuthorizationHeader(accessToken: string, tokenType?: string) {
  const normalizedType = tokenType && tokenType.trim() ? tokenType.trim() : 'Bearer'
  return `${normalizedType} ${accessToken}`
}

function getRequestStatus(error: unknown) {
  if (!(error instanceof Error)) {
    return null
  }

  const maybeStatus = (error as Error & { status?: number }).status
  return typeof maybeStatus === 'number' ? maybeStatus : null
}

function getInitialEventForm(): EventForm {
  return {
    studentName: '',
    studentRollNumber: '',
    eventName: '',
    eventLocation: '',
    eventDate: '',
    eventDescription: '',
  }
}

function getInitialMonthFilter(): MonthFilter {
  return {
    year: `${new Date().getFullYear()}`,
    month: `${new Date().getMonth() + 1}`,
  }
}

function getInitialEventLookup(): EventLookup {
  return {
    eventId: '',
  }
}

function mapEventToForm(eventModel: EventModel): EventForm {
  return {
    studentName: eventModel.studentName,
    studentRollNumber: eventModel.studentRollNumber,
    eventName: eventModel.eventName,
    eventLocation: eventModel.eventLocation,
    eventDate: normalizeDateForInput(eventModel.eventDate),
    eventDescription: eventModel.eventDescription,
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState('')
  const [activeFaculty, setActiveFaculty] = useState<FacultySession | null>(null)
  const [activeStudent, setActiveStudent] = useState<StudentSession | null>(null)
  const [facultyAuthorization, setFacultyAuthorization] = useState<string | null>(null)
  const [studentAuthorization, setStudentAuthorization] = useState<string | null>(null)

  const [facultyForm, setFacultyForm] = useState<FacultyForm>({
    facultyId: '',
    facultyName: '',
    emailId: '',
    password: '',
  })

  const [facultyLogin, setFacultyLogin] = useState<Credentials>({
    emailId: '',
    password: '',
  })

  const [studentForm, setStudentForm] = useState<StudentForm>({
    studentName: '',
    rollNumber: '',
    emailId: '',
    password: '',
  })

  const [studentLogin, setStudentLogin] = useState<Credentials>({
    emailId: '',
    password: '',
  })

  const [eventForm, setEventForm] = useState<EventForm>(getInitialEventForm)
  const [monthFilter, setMonthFilter] = useState<MonthFilter>(getInitialMonthFilter)
  const [eventLookup, setEventLookup] = useState<EventLookup>(getInitialEventLookup)

  const [studentEventsRoll, setStudentEventsRollState] = useState('')
  const [monthEvents, setMonthEvents] = useState<Array<EventModel>>([])
  const [facultyEvents, setFacultyEvents] = useState<Array<EventModel>>([])
  const [studentEvents, setStudentEvents] = useState<Array<EventModel>>([])
  const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null)

  function updateFacultyForm(field: keyof FacultyForm, value: string) {
    setFacultyForm((existing) => ({ ...existing, [field]: value }))
  }

  function updateFacultyLogin(field: keyof Credentials, value: string) {
    setFacultyLogin((existing) => ({ ...existing, [field]: value }))
  }

  function updateStudentForm(field: keyof StudentForm, value: string) {
    setStudentForm((existing) => ({ ...existing, [field]: value }))
  }

  function updateStudentLogin(field: keyof Credentials, value: string) {
    setStudentLogin((existing) => ({ ...existing, [field]: value }))
  }

  function updateEventForm(field: keyof EventForm, value: string) {
    setEventForm((existing) => ({ ...existing, [field]: value }))
  }

  function updateMonthFilter(field: keyof MonthFilter, value: string) {
    setMonthFilter((existing) => ({ ...existing, [field]: value }))
  }

  function updateEventLookup(field: keyof EventLookup, value: string) {
    setEventLookup((existing) => ({ ...existing, [field]: value }))
  }

  function setStudentEventsRoll(value: string) {
    setStudentEventsRollState(value)
  }

  function syncEventSelection(eventModel: EventModel) {
    setSelectedEvent(eventModel)
    setEventLookup((existing) => ({
      ...existing,
      eventId: eventModel.id ?? existing.eventId,
    }))
    setEventForm(mapEventToForm(eventModel))
  }

  function selectFacultyEventForManagement(eventModel: EventModel) {
    syncEventSelection(eventModel)
    setStatus(`Loaded event: ${eventModel.eventName}`)
  }

  function clearFacultySession(message: string) {
    setActiveFaculty(null)
    setFacultyAuthorization(null)
    setMonthEvents([])
    setFacultyEvents([])
    setSelectedEvent(null)
    setEventLookup(getInitialEventLookup())
    setEventForm(getInitialEventForm())
    setMonthFilter(getInitialMonthFilter())
    setStatus(message)
  }

  function clearStudentSession(message: string) {
    setActiveStudent(null)
    setStudentAuthorization(null)
    setStudentEventsRollState('')
    setStudentEvents([])
    setStatus(message)
  }

  function logoutFaculty() {
    clearFacultySession('Faculty logged out')
  }

  function logoutStudent() {
    clearStudentSession('Student logged out')
  }

  async function registerFaculty() {
    try {
      const createdFaculty = await requestJson<FacultySession>(`${apiBases.facultyApiBase}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyForm),
      })

      setStatus(`Faculty created: ${createdFaculty.facultyName}`)
      return true
    } catch (error) {
      setStatus(getErrorMessage(error))
      return false
    }
  }

  async function loginFaculty() {
    try {
      const response = await requestJson<FacultyAuthResponse>(`${apiBases.facultyApiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyLogin),
      })

      if (!response.accessToken) {
        setStatus('Faculty login failed')
        return false
      }

      const session: FacultySession = {
        facultyId: response.facultyId,
        facultyName: response.facultyName,
        emailId: response.emailId,
      }

      setActiveFaculty(session)
      setFacultyAuthorization(buildAuthorizationHeader(response.accessToken, response.tokenType))
      setEventLookup(getInitialEventLookup())
      setMonthEvents([])
      setFacultyEvents([])
      setSelectedEvent(null)
      setStatus(`Welcome faculty: ${session.facultyName}`)
      return true
    } catch (error) {
      setStatus(getErrorMessage(error))
      return false
    }
  }

  async function registerStudent() {
    try {
      const createdStudent = await requestJson<StudentSession>(`${apiBases.studentApiBase}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm),
      })

      setStatus(`Student created: ${createdStudent.studentName}`)
      return true
    } catch (error) {
      setStatus(getErrorMessage(error))
      return false
    }
  }

  async function loginStudent() {
    try {
      const response = await requestJson<StudentAuthResponse>(`${apiBases.studentApiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentLogin),
      })

      if (!response.accessToken) {
        setStatus('Student login failed')
        return false
      }

      const session: StudentSession = {
        studentName: response.studentName,
        rollNumber: response.rollNumber,
        emailId: response.emailId,
      }

      setActiveStudent(session)
      setStudentAuthorization(buildAuthorizationHeader(response.accessToken, response.tokenType))
      setStudentEventsRollState(session.rollNumber)
      setStudentEvents([])
      setStatus(`Welcome student: ${session.studentName}`)
      return true
    } catch (error) {
      setStatus(getErrorMessage(error))
      return false
    }
  }

  async function addEvent() {
    if (!facultyAuthorization) {
      setStatus('Faculty login required')
      return
    }

    try {
      const createdEvent = await requestJson<EventModel>(`${apiBases.eventApiBase}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: facultyAuthorization,
        },
        body: JSON.stringify(eventForm),
      })

      syncEventSelection(createdEvent)
      setFacultyEvents((existing) => {
        if (!createdEvent.id) {
          return [createdEvent, ...existing]
        }

        return [createdEvent, ...existing.filter((facultyEvent) => facultyEvent.id !== createdEvent.id)]
      })
      setStatus(`Event added: ${createdEvent.eventName}`)
    } catch (error) {
      if (getRequestStatus(error) === 401) {
        clearFacultySession('Faculty session expired. Please login again.')
        return
      }
      setStatus(getErrorMessage(error))
    }
  }

  async function fetchFacultyEvents() {
    if (!facultyAuthorization) {
      setStatus('Faculty login required')
      return
    }

    try {
      const events = await requestJson<Array<EventModel>>(`${apiBases.eventApiBase}/faculty`, {
        headers: { Authorization: facultyAuthorization },
      })

      setFacultyEvents(events)
      setStatus(`Loaded ${events.length} event(s) for management`)
    } catch (error) {
      if (getRequestStatus(error) === 401) {
        clearFacultySession('Faculty session expired. Please login again.')
        return
      }
      setStatus(getErrorMessage(error))
    }
  }

  async function fetchEventsByMonth() {
    if (!facultyAuthorization) {
      setStatus('Faculty login required')
      return
    }

    try {
      const events = await requestJson<Array<EventModel>>(
        `${apiBases.eventApiBase}/month/${monthFilter.year}/${monthFilter.month}`,
        {
          headers: { Authorization: facultyAuthorization },
        },
      )

      setMonthEvents(events)
      setStatus(`Loaded ${events.length} event(s) for month`)
    } catch (error) {
      if (getRequestStatus(error) === 401) {
        clearFacultySession('Faculty session expired. Please login again.')
        return
      }
      setStatus(getErrorMessage(error))
    }
  }

  async function fetchEventsByStudentRoll() {
    if (!studentEventsRoll) {
      setStatus('Enter roll number first')
      return
    }

    if (!studentAuthorization) {
      setStatus('Student login required')
      return
    }

    try {
      const events = await requestJson<Array<EventModel>>(
        `${apiBases.studentApiBase}/events/${encodeURIComponent(studentEventsRoll)}`,
        {
          headers: { Authorization: studentAuthorization },
        },
      )

      setStudentEvents(events)
      setStatus(`Loaded ${events.length} event(s) for roll number`)
    } catch (error) {
      if (getRequestStatus(error) === 401) {
        clearStudentSession('Student session expired. Please login again.')
        return
      }
      setStatus(getErrorMessage(error))
    }
  }

  async function loadEventById() {
    if (!eventLookup.eventId) {
      setStatus('Enter event ID first')
      return
    }

    if (!facultyAuthorization) {
      setStatus('Faculty login required')
      return
    }

    try {
      const loadedEvent = await requestJson<EventModel | null>(`${apiBases.eventApiBase}/${eventLookup.eventId}`, {
        headers: { Authorization: facultyAuthorization },
      })

      if (!loadedEvent) {
        setStatus('Event not found')
        return
      }

      syncEventSelection(loadedEvent)
      setStatus(`Loaded event: ${loadedEvent.eventName}`)
    } catch (error) {
      if (getRequestStatus(error) === 401) {
        clearFacultySession('Faculty session expired. Please login again.')
        return
      }
      setStatus(getErrorMessage(error))
    }
  }

  async function updateEvent() {
    if (!eventLookup.eventId) {
      setStatus('Enter event ID first')
      return
    }

    if (!facultyAuthorization) {
      setStatus('Faculty login required')
      return
    }

    try {
      const updatedEvent = await requestJson<EventModel | null>(
        `${apiBases.eventApiBase}/update/${eventLookup.eventId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: facultyAuthorization,
          },
          body: JSON.stringify(eventForm),
        },
      )

      if (!updatedEvent) {
        setStatus('Unable to update this event')
        return
      }

      syncEventSelection(updatedEvent)
      setMonthEvents((existing) =>
        existing.map((monthEvent) => (monthEvent.id === updatedEvent.id ? updatedEvent : monthEvent)),
      )
      setFacultyEvents((existing) =>
        existing.map((facultyEvent) => (facultyEvent.id === updatedEvent.id ? updatedEvent : facultyEvent)),
      )
      setStudentEvents((existing) =>
        existing.map((studentEvent) => (studentEvent.id === updatedEvent.id ? updatedEvent : studentEvent)),
      )
      setStatus(`Updated event: ${updatedEvent.eventName}`)
    } catch (error) {
      if (getRequestStatus(error) === 401) {
        clearFacultySession('Faculty session expired. Please login again.')
        return
      }
      setStatus(getErrorMessage(error))
    }
  }

  async function deleteEvent() {
    if (!eventLookup.eventId) {
      setStatus('Enter event ID first')
      return
    }

    if (!facultyAuthorization) {
      setStatus('Faculty login required')
      return
    }

    try {
      const isDeleted = await requestJson<boolean>(`${apiBases.eventApiBase}/delete/${eventLookup.eventId}`, {
        method: 'DELETE',
        headers: { Authorization: facultyAuthorization },
      })

      if (!isDeleted) {
        setStatus('Delete failed for this event')
        return
      }

      setMonthEvents((existing) => existing.filter((monthEvent) => monthEvent.id !== eventLookup.eventId))
      setFacultyEvents((existing) => existing.filter((facultyEvent) => facultyEvent.id !== eventLookup.eventId))
      setStudentEvents((existing) => existing.filter((studentEvent) => studentEvent.id !== eventLookup.eventId))
      setSelectedEvent((existing) => (existing?.id === eventLookup.eventId ? null : existing))
      setEventLookup(getInitialEventLookup())
      setEventForm(getInitialEventForm())
      setStatus('Event deleted')
    } catch (error) {
      if (getRequestStatus(error) === 401) {
        clearFacultySession('Faculty session expired. Please login again.')
        return
      }
      setStatus(getErrorMessage(error))
    }
  }

  return (
    <AppContext.Provider
      value={{
        status,
        activeFaculty,
        activeStudent,
        facultyForm,
        facultyLogin,
        studentForm,
        studentLogin,
        eventForm,
        monthFilter,
        eventLookup,
        studentEventsRoll,
        monthEvents,
        facultyEvents,
        studentEvents,
        selectedEvent,
        updateFacultyForm,
        updateFacultyLogin,
        updateStudentForm,
        updateStudentLogin,
        updateEventForm,
        updateMonthFilter,
        updateEventLookup,
        setStudentEventsRoll,
        logoutFaculty,
        logoutStudent,
        registerFaculty,
        loginFaculty,
        registerStudent,
        loginStudent,
        addEvent,
        fetchFacultyEvents,
        fetchEventsByMonth,
        fetchEventsByStudentRoll,
        selectFacultyEventForManagement,
        loadEventById,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
