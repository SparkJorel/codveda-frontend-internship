import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="route-view mx-auto flex max-w-[1280px] flex-col items-start px-4 py-24 sm:px-8">
      <p className="eyebrow mb-3">Error 404</p>
      <h1 className="mb-4 text-4xl sm:text-5xl">This page does not exist.</h1>
      <p className="mb-8 max-w-[46ch]">
        The address you followed does not match any route in this application.
      </p>
      <Link to="/" className="btn btn-accent">Back to home</Link>
    </div>
  )
}
