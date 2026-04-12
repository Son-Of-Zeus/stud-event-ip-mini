import { Link } from 'react-router-dom'

export default function StudentPage() {
  return (
    <section className="space-y-3">
      <div className="panel panel-soft">
        <p className="kicker">Student Portal</p>
        <h2 className="panel-title mt-2">How would you like to continue?</h2>
        <p className="panel-subtitle">Choose one option to proceed.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/student/register" className="option-card">
          <h3 className="card-title hover-accent">Register</h3>
          <p className="panel-subtitle">Create a new student account.</p>
        </Link>

        <Link to="/student/login" className="option-card">
          <h3 className="card-title hover-accent">Login</h3>
          <p className="panel-subtitle">Sign in with your existing student account.</p>
        </Link>
      </div>

      <p className="muted-copy">
        Faculty user?{' '}
        <Link to="/faculty" className="text-link">
          Switch to faculty portal
        </Link>
      </p>
    </section>
  )
}
