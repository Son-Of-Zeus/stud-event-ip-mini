import { type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext'

const inputClass = 'form-input'

export default function FacultyLoginPage() {
  const { activeFaculty, facultyLogin, updateFacultyLogin, loginFaculty } = useAppContext()
  const navigate = useNavigate()

  if (activeFaculty) {
    return <Navigate to="/faculty/home" replace />
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const ok = await loginFaculty()
    if (ok) {
      navigate('/faculty/home')
    }
  }

  return (
    <section className="panel mx-auto max-w-xl">
      <h2 className="panel-title">Faculty Login</h2>
      <p className="panel-subtitle">Sign in to continue to faculty dashboard.</p>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="field-label" htmlFor="faculty-login-email">
            Email
          </label>
          <input
            id="faculty-login-email"
            type="email"
            className={inputClass}
            value={facultyLogin.emailId}
            onChange={(event) => updateFacultyLogin('emailId', event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="faculty-login-pass">
            Password
          </label>
          <input
            id="faculty-login-pass"
            type="password"
            className={inputClass}
            value={facultyLogin.password}
            onChange={(event) => updateFacultyLogin('password', event.target.value)}
            required
          />
        </div>

        <button className="btn-dark" type="submit">
          Login
        </button>
      </form>

      <p className="muted-copy mt-4">
        New faculty?{' '}
        <Link to="/faculty/register" className="text-link">
          Register here
        </Link>
      </p>
    </section>
  )
}
