import { Link } from 'react-router-dom'

export default function DashboardPage() {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      <Link to="/faculty" className="option-card">
        <p className="kicker">Faculty Access</p>
        <h2 className="card-title hover-accent mt-3">Continue as Faculty</h2>
        <p className="panel-subtitle">Register or login to create, update, delete and review event records.</p>
        <span className="hover-accent mt-4 inline-flex text-sm font-semibold">Get Started</span>
      </Link>

      <Link to="/student" className="option-card">
        <p className="kicker">Student Access</p>
        <h2 className="card-title hover-accent mt-3">Continue as Student</h2>
        <p className="panel-subtitle">Register or login to fetch your event feed and stay updated.</p>
        <span className="hover-accent mt-4 inline-flex text-sm font-semibold">Get Started</span>
      </Link>
    </section>
  )
}
