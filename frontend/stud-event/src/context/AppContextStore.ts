import { createContext } from 'react'

import type {
  EventModel,
  FacultyModel,
  FacultySession,
  StudentModel,
  StudentSession,
} from '../types/models'

export type Credentials = {
  emailId: string
  password: string
}

export type FacultyForm = Omit<FacultyModel, 'id'>
export type StudentForm = Omit<StudentModel, 'id'>
export type EventForm = Omit<EventModel, 'id' | 'facultyId'>

export type MonthFilter = {
  year: string
  month: string
}

export type EventLookup = {
  eventId: string
}

export type AppContextValue = {
  status: string
  activeFaculty: FacultySession | null
  activeStudent: StudentSession | null
  facultyForm: FacultyForm
  facultyLogin: Credentials
  studentForm: StudentForm
  studentLogin: Credentials
  eventForm: EventForm
  monthFilter: MonthFilter
  eventLookup: EventLookup
  studentEventsRoll: string
  monthEvents: Array<EventModel>
  facultyEvents: Array<EventModel>
  studentEvents: Array<EventModel>
  selectedEvent: EventModel | null
  updateFacultyForm: (field: keyof FacultyForm, value: string) => void
  updateFacultyLogin: (field: keyof Credentials, value: string) => void
  updateStudentForm: (field: keyof StudentForm, value: string) => void
  updateStudentLogin: (field: keyof Credentials, value: string) => void
  updateEventForm: (field: keyof EventForm, value: string) => void
  updateMonthFilter: (field: keyof MonthFilter, value: string) => void
  updateEventLookup: (field: keyof EventLookup, value: string) => void
  setStudentEventsRoll: (value: string) => void
  logoutFaculty: () => void
  logoutStudent: () => void
  registerFaculty: () => Promise<boolean>
  loginFaculty: () => Promise<boolean>
  registerStudent: () => Promise<boolean>
  loginStudent: () => Promise<boolean>
  addEvent: () => Promise<void>
  fetchFacultyEvents: () => Promise<void>
  fetchEventsByMonth: () => Promise<void>
  fetchEventsByStudentRoll: () => Promise<void>
  selectFacultyEventForManagement: (eventModel: EventModel) => void
  loadEventById: () => Promise<void>
  updateEvent: () => Promise<void>
  deleteEvent: () => Promise<void>
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)
