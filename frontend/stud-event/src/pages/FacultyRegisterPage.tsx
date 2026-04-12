import { type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext'

const inputClass = 'form-input'

export default function FacultyRegisterPage() {
  const { activeFaculty, facultyForm, updateFacultyForm, registerFaculty } = useAppContext()
  const navigate = useNavigate()

  if (activeFaculty) {
    return <Navigate to="/faculty/home" replace />
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const ok = await registerFaculty()
    if (ok) {
      navigate('/faculty/login')
    }
  }

  return (
    <section className="panel mx-auto max-w-2xl">
      <h2 className="panel-title">Faculty Registration</h2>
      <p className="panel-subtitle">Create your account to access faculty services.</p>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="field-label" htmlFor="faculty-id">
            Faculty ID
          </label>
          <input
            id="faculty-id"
            className={inputClass}
            value={facultyForm.facultyId}
            onChange={(event) => updateFacultyForm('facultyId', event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="faculty-name">
            Faculty Name
          </label>
          <input
            id="faculty-name"
            className={inputClass}
            value={facultyForm.facultyName}
            onChange={(event) => updateFacultyForm('facultyName', event.target.value)}
            required
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="faculty-email">
              Email
            </label>
            <input
              id="faculty-email"
              type="email"
              className={inputClass}
              value={facultyForm.emailId}
              onChange={(event) => updateFacultyForm('emailId', event.target.value)}
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="faculty-pass">
              Password
            </label>
            <input
              id="faculty-pass"
              type="password"
              className={inputClass}
              value={facultyForm.password}
              onChange={(event) => updateFacultyForm('password', event.target.value)}
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
        <Link to="/faculty/login" className="text-link">
          Login here
        </Link>
      </p>
    </section>
  )
}
