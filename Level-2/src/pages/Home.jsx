import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

const SERVICES = [
  { n: '01', title: 'Web Development', text: 'Custom web applications, responsive design and e-commerce solutions that drive business growth.', accent: 'border-t-brand-blue' },
  { n: '02', title: 'AI / ML Solutions', text: 'Harness the power of artificial intelligence and machine learning for your business.', accent: 'border-t-brand-amber' },
  { n: '03', title: 'Mobile App Development', text: 'Native and cross-platform mobile applications that deliver exceptional user experiences.', accent: 'border-t-brand-red' },
]

const STATS = [
  { value: '1,800+', label: 'Happy interns' },
  { value: '200+', label: 'Stipend scholars' },
  { value: '50+', label: 'Expert mentors' },
  { value: '20+', label: 'Clients' },
]

export default function Home() {
  const { saved } = useApp()

  return (
    <div className="route-view">
      <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-4">Codveda Technologies &mdash; Education &amp; IT services</p>
            <h1 className="mb-6 text-5xl sm:text-6xl">Empowering growth with IT.</h1>
            <p className="font-ui mb-2 text-base font-semibold text-ink">
              Transforming Education, Careers &amp; Technology
            </p>
            <p className="mb-8 max-w-[48ch] text-base">
              Empowering students and freshers with internships, training and industry-ready
              projects &mdash; plus IT services for growing businesses.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/explore" className="btn btn-accent">Explore the API demo</Link>
              <Link to="/contact" className="btn btn-ghost">Get a quote</Link>
            </div>
          </div>

          <aside className="card border-t-[3px] border-t-accent p-6 lg:col-span-4" aria-label="Internship tracks">
            <p className="eyebrow mb-4 border-b border-line pb-4 text-stone">Internship tracks</p>
            <ul className="grid gap-3 text-sm text-ink">
              {['AI / ML', 'Data Science', 'Web Development', 'Business Analytics'].map((track, i) => (
                <li key={track} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={[
                      'h-2 w-2 shrink-0',
                      ['bg-brand-blue rotate-45', 'bg-brand-amber rounded-full', 'bg-brand-red', 'bg-accent-deep rotate-45'][i],
                    ].join(' ')}
                  />
                  {track}
                </li>
              ))}
            </ul>
            <p className="font-ui mt-5 border-t border-line pt-4 text-xs text-stone">
              1 month &middot; Remote &middot; Certificate
            </p>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-band py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <header className="mb-10 max-w-[44rem]">
            <p className="eyebrow mb-3">Our services</p>
            <h2 className="mb-4 text-3xl sm:text-4xl">What we offer.</h2>
            <p className="text-base">
              Comprehensive IT solutions tailored to your business needs &mdash; combining
              technology, innovation and expertise.
            </p>
          </header>

          <ul className="grid gap-4 md:grid-cols-3">
            {SERVICES.map((service) => (
              <li key={service.n} className={`card border-t-[3px] ${service.accent} p-7`}>
                <p className="font-ui mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-stone">
                  {service.n}
                </p>
                <h3 className="mb-3 text-xl">{service.title}</h3>
                <p className="text-sm">{service.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <header className="mb-10">
            <p className="eyebrow mb-3">Our impact</p>
            <h2 className="text-3xl sm:text-4xl">Numbers we let clients audit.</h2>
          </header>

          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={[
                  'border-t-[3px] pt-5',
                  ['border-t-brand-blue', 'border-t-brand-amber', 'border-t-brand-red', 'border-t-accent-deep'][i],
                ].join(' ')}
              >
                <dd className="font-display text-4xl font-semibold leading-none text-ink">{stat.value}</dd>
                <dt className="font-ui mt-2 text-xs font-medium uppercase tracking-[0.12em] text-stone">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-accent py-20 text-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <p className="eyebrow mb-3 text-white/75">Get in touch</p>
          <h2 className="mb-4 text-3xl text-white sm:text-4xl">Join our journey.</h2>
          <p className="mb-8 max-w-[46ch] text-white/90">
            Take the first step towards transforming your career with our training
            programmes and internship opportunities.
            {saved.length > 0 && ` You currently have ${saved.length} saved repositories.`}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:support@codveda.com" className="btn bg-white text-accent hover:bg-paper">
              support@codveda.com
            </a>
            <Link to="/about" className="btn border-white/55 text-white hover:bg-white hover:text-accent">
              About us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
