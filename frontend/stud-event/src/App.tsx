import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import FacultyPage from './pages/FacultyPage'
import StudentPage from './pages/StudentPage'
import FacultyHomePage from './pages/FacultyHomePage'
import StudentHomePage from './pages/StudentHomePage'
import FacultyRegisterPage from './pages/FacultyRegisterPage'
import FacultyLoginPage from './pages/FacultyLoginPage'
import StudentRegisterPage from './pages/StudentRegisterPage'
import StudentLoginPage from './pages/StudentLoginPage'
import EventsPage from './pages/EventsPage'
import MonthEventsPage from './pages/MonthEventsPage'
import ManageEventPage from './pages/ManageEventPage'
import StudentEventsPage from './pages/StudentEventsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="faculty/register" element={<FacultyRegisterPage />} />
        <Route path="faculty/login" element={<FacultyLoginPage />} />
        <Route path="faculty/home" element={<FacultyHomePage />} />
        <Route path="student" element={<StudentPage />} />
        <Route path="student/register" element={<StudentRegisterPage />} />
        <Route path="student/login" element={<StudentLoginPage />} />
        <Route path="student/home" element={<StudentHomePage />} />
        <Route path="events" element={<Navigate to="/events/create" replace />} />
        <Route path="events/create" element={<EventsPage />} />
        <Route path="events/month" element={<MonthEventsPage />} />
        <Route path="events/manage" element={<ManageEventPage />} />
        <Route path="student-events" element={<Navigate to="/student/events" replace />} />
        <Route path="student/events" element={<StudentEventsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
