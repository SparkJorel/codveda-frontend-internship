import { useState } from 'react'

const RULES = {
  name: (v) =>
    !v ? 'Your full name is required.'
      : v.trim().length < 2 ? 'That looks too short.'
      : null,
  email: (v) =>
    !v ? 'We need an email address to reply.'
      : !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(v) ? 'Check for a missing @ or domain.'
      : null,
  message: (v) =>
    !v ? 'Please tell us what you need.'
      : v.trim().length < 20 ? 'A little more detail would help — 20 characters minimum.'
      : null,
}

const EMPTY = { name: '', email: '', message: '' }

export default function Contact() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [sent, setSent] = useState(false)

  // Same rule as Level 1: a field is only judged once it has been left, then
  // it re-validates on every keystroke so fixes clear immediately.
  const validate = (field, value) => {
    const message = RULES[field](value)
    setErrors((prev) => ({ ...prev, [field]: message }))
    return message
  }

  const handleChange = (field) => (event) => {
    const { value } = event.target
    setValues((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) validate(field, value)
  }

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validate(field, values[field])
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = {}
    for (const field of Object.keys(RULES)) next[field] = RULES[field](values[field])
    setErrors(next)
    setTouched({ name: true, email: true, message: true })

    const firstInvalid = Object.keys(next).find((field) => next[field])
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="route-view mx-auto max-w-[1280px] px-4 py-24 sm:px-8">
        <p className="eyebrow mb-3">Contact</p>
        <h1 className="mb-4 text-4xl">Message noted.</h1>
        <p className="mb-8 max-w-[48ch]">
          Thank you, {values.name.trim()}. This is a front-end demonstration, so nothing
          was transmitted — the form has no backend and stores nothing.
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => { setValues(EMPTY); setErrors({}); setTouched({}); setSent(false) }}
        >
          Write another message
        </button>
      </div>
    )
  }

  return (
    <div className="route-view mx-auto max-w-[1280px] px-4 py-14 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-12">
        <header className="lg:col-span-5">
          <p className="eyebrow mb-3">Contact</p>
          <h1 className="mb-5 text-4xl sm:text-5xl">Tell us what you&rsquo;re building.</h1>
          <p className="mb-8">
            One reply from the team, usually within a working day.
          </p>

          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="eyebrow mb-1 text-stone">Email</dt>
              <dd><a href="mailto:support@codveda.com" className="text-accent hover:underline">support@codveda.com</a></dd>
            </div>
            <div>
              <dt className="eyebrow mb-1 text-stone">Office</dt>
              <dd>Chandrapur, Maharashtra</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1 text-stone">Web</dt>
              <dd>
                <a href="https://www.codveda.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  www.codveda.com
                </a>
              </dd>
            </div>
          </dl>
        </header>

        <form className="card grid gap-5 p-7 lg:col-span-7" onSubmit={handleSubmit} noValidate>
          <Field id="name" label="Full name" value={values.name} error={errors.name}
                 onChange={handleChange('name')} onBlur={handleBlur('name')}
                 autoComplete="name" placeholder="Jorel Tiomela Zangue" />

          <Field id="email" label="Email address" type="email" value={values.email} error={errors.email}
                 onChange={handleChange('email')} onBlur={handleBlur('email')}
                 autoComplete="email" placeholder="you@company.com" />

          <Field id="message" label="Message" as="textarea" value={values.message} error={errors.message}
                 onChange={handleChange('message')} onBlur={handleBlur('message')}
                 placeholder="A few lines about your project…" />

          <button type="submit" className="btn btn-accent">Send message</button>

          <p className="font-ui text-center text-xs text-stone">
            Front-end demonstration &mdash; no data is stored or transmitted.
          </p>
        </form>
      </div>
    </div>
  )
}

function Field({ id, label, as, error, ...props }) {
  const Tag = as === 'textarea' ? 'textarea' : 'input'
  const invalid = Boolean(error)

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="eyebrow text-stone">{label}</label>
      <Tag
        id={id}
        name={id}
        rows={as === 'textarea' ? 5 : undefined}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={[
          'w-full rounded-[4px] border bg-bone px-4 py-3 text-base text-ink transition-colors placeholder:text-stone focus:outline-none',
          invalid ? 'border-signal' : 'border-line hover:border-ink focus:border-accent',
        ].join(' ')}
        {...props}
      />
      <p id={`${id}-error`} role="alert" className="font-ui min-h-4 text-xs font-medium text-signal">
        {error ?? ''}
      </p>
    </div>
  )
}
