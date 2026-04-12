import { type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext'

const inputClass = 'form-input'

export default function StudentRegisterPage() {
  const { activeStudent, studentForm, updateStudentForm, registerStudent } = useAppContext()
  const navigate = useNavigate()

  if (activeStudent) {
    return <Navigate to="/student/home" replace />
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const ok = await registerStudent()
    if (ok) {
      navigate('/student/login')
    }
  }

  return (
    <section className="panel mx-auto max-w-2xl">
      <h2 className="panel-title">Student Registration</h2>
      <p className="panel-subtitle">Create your account to access student services.</p>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="field-label" htmlFor="student-name">
            Student Name
          </label>
          <input
            id="student-name"
            className={inputClass}
            value={studentForm.studentName}
            onChange={(event) => updateStudentForm('studentName', event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="student-roll">
            Roll Number
          </label>
          <input
            id="student-roll"
            className={inputClass}
            value={studentForm.rollNumber}
            onChange={(event) => updateStudentForm('rollNumber', event.target.value)}
            required
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="student-email">
              Email
            </label>
            <input
              id="student-email"
              type="email"
              className={inputClass}
              value={studentForm.emailId}
              onChange={(event) => updateStudentForm('emailId', event.target.value)}
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="student-pass">
              Password
            </label>
            <input
              id="student-pass"
              type="password"
              className={inputClass}
              value={studentForm.password}
              onChange={(event) => updateStudentForm('password', event.target.value)}
              required
            />
          </div>
        </div>

        <button className="btn-dark" type="submit">
          Register
        </button>
      </form>

      <p className="muted-copy mt-4">
        Already registered?{' '}
        <Link to="/student/login" className="text-link">
          Login here
        </Link>
      </p>
    </section>
  )
}
