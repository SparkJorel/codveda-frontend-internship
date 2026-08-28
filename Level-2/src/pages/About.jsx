const VALUES = [
  ['Excellence', 'We strive for excellence in everything we do, from developing solutions to nurturing talent.'],
  ['Innovation', 'We embrace creative thinking, constantly exploring new technologies and methodologies.'],
  ['Integrity', 'We conduct ourselves with honesty, transparency and ethical practices.'],
  ['Collaboration', 'We believe in teamwork, fostering an environment where diverse perspectives meet.'],
  ['Empowerment', 'We equip individuals and organisations with the knowledge and tools to succeed.'],
  ['Responsibility', 'We embrace our social responsibility through sustainable, ethical practices.'],
]

export default function About() {
  return (
    <div className="route-view mx-auto max-w-[1280px] px-4 py-14 sm:px-8">
      <header className="mb-14 max-w-[46rem]">
        <p className="eyebrow mb-3">About us</p>
        <h1 className="mb-5 text-4xl sm:text-5xl">Innovative solutions, exceptional results.</h1>
        <p className="text-base">
          Founded with a vision to bridge the gap between education and industry
          requirements, Codveda Technologies has emerged as an IT solutions provider
          and educational institution.
        </p>
      </header>

      <div className="mb-14 grid gap-4 md:grid-cols-2">
        <article className="card border-l-[3px] border-l-brand-blue p-7">
          <p className="eyebrow mb-4 text-stone">Our mission</p>
          <p>
            To empower individuals with cutting-edge technical skills and provide
            businesses with innovative solutions that drive growth and success.
          </p>
        </article>
        <article className="card border-l-[3px] border-l-brand-amber p-7">
          <p className="eyebrow mb-4 text-stone">Our vision</p>
          <p>
            To be the most trusted partner in digital transformation and technical
            education, creating a positive impact on society through technology and
            innovation.
          </p>
        </article>
      </div>

      <section>
        <header className="mb-8">
          <p className="eyebrow mb-3">Our values</p>
          <h2 className="text-3xl">What we hold ourselves to.</h2>
        </header>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(([title, text], i) => (
            <li
              key={title}
              className={[
                'card border-t-[3px] p-6',
                ['border-t-brand-blue', 'border-t-brand-amber', 'border-t-brand-red'][i % 3],
              ].join(' ')}
            >
              <h3 className="mb-2 text-lg">{title}</h3>
              <p className="text-sm">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-[4px] border border-line bg-band p-7">
        <p className="eyebrow mb-3 text-stone">Registrations</p>
        <ul className="font-ui grid gap-3 text-xs text-stone sm:grid-cols-3">
          <li><span className="block font-semibold uppercase tracking-[0.12em] text-ink">AICTE ID</span>CORPORATE67458898e8a1a1732610200</li>
          <li><span className="block font-semibold uppercase tracking-[0.12em] text-ink">MSME No.</span>UDYAM-MH-08-0043740</li>
          <li><span className="block font-semibold uppercase tracking-[0.12em] text-ink">ISO 9001:2015</span>Certificate no. TSNUK10828</li>
        </ul>
      </section>
    </div>
  )
}
