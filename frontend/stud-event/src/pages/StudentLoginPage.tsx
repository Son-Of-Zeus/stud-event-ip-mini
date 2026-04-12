import { type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useAppContext } from '../context/useAppContext'

const inputClass = 'form-input'

export default function StudentLoginPage() {
  const { activeStudent, studentLogin, updateStudentLogin, loginStudent } = useAppContext()
  const navigate = useNavigate()

  if (activeStudent) {
    return <Navigate to="/student/home" replace />
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const ok = await loginStudent()
    if (ok) {
      navigate('/student/home')
    }
  }

  return (
    <section className="panel mx-auto max-w-xl">
      <h2 className="panel-title">Student Login</h2>
      <p className="panel-subtitle">Sign in to continue to student dashboard.</p>

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="field-label" htmlFor="student-login-email">
            Email
          </label>
          <input
            id="student-login-email"
            type="email"
            className={inputClass}
            value={studentLogin.emailId}
            onChange={(event) => updateStudentLogin('emailId', event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="student-login-pass">
            Password
          </label>
          <input
            id="student-login-pass"
            type="password"
            className={inputClass}
            value={studentLogin.password}
            onChange={(event) => updateStudentLogin('password', event.target.value)}
            required
          />
        </div>

        <button className="btn-dark" type="submit">
          Login
        </button>
      </form>

      <p className="muted-copy mt-4">
        New student?{' '}
        <Link to="/student/register" className="text-link">
          Register here
        </Link>
      </p>
    </section>
  )
}
