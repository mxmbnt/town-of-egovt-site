import { Container, Icon, SectionHeading } from '../../../components/ui.jsx'

const members = [
  { name: 'Wenalbooze', role: 'Councilor, District 3', mail: 'district3@citygov.com', phone: '(+91)800238798', img: '/img/team/1.png' },
  { name: 'Kanaov Marla', role: 'Councilor, District 2', mail: 'district2@citygov.com', phone: '(+91)8002354565', img: '/img/team/2.png' },
  { name: 'Dinaval Jall', role: 'Councilor, District 1', mail: 'district1@citygov.com', phone: '(+91)8002352321', img: '/img/team/3.png' },
  { name: 'Cevin Peter', role: 'City Council President', mail: 'president@citygov.com', phone: '(+91)8002359595', img: '/img/team/4.jpg' },
]

const partners = ['stylus', 'tree', 'brook', 'itsalive', 'nowhere']

export default function Council() {
  return (
    <section className="pt-[110px]">
      <Container>
        <SectionHeading
          center
          title="Meet City Council"
          text="The city council have the real super powers as administraion to lead country."
        />

        <div className="mt-[70px] grid gap-[30px] px-0 sm:grid-cols-2 lg:grid-cols-4 lg:px-[15px]">
          {members.map((m) => (
            <article key={m.name} className="group bg-white shadow-card">
              <div className="overflow-hidden">
                <img
                  src={m.img}
                  alt={m.name}
                  className="aspect-[283/285] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="px-[25px] pt-6 pb-9">
                <h3 className="text-[24px] font-medium">
                  <a href="#" className="hover:text-accent">
                    {m.name}
                  </a>
                </h3>
                <p className="font-heading text-[18px] text-link">{m.role}</p>
                <span className="mt-4 mb-4 block h-px w-10 bg-line" />
                <a href={`mailto:${m.mail}`} className="flex items-center gap-2.5 text-[16px] hover:text-accent">
                  <Icon.mail className="h-[14px] w-[14px] text-ink" />
                  {m.mail}
                </a>
                <a href={`tel:${m.phone}`} className="mt-2 flex items-center gap-2.5 text-[16px] hover:text-accent">
                  <Icon.phone className="h-[14px] w-[14px] text-ink" />
                  {m.phone}
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-2 items-center gap-10 py-[110px] sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((p) => (
            <img
              key={p}
              src={`/img/logos/${p}.png`}
              alt={p}
              className="mx-auto max-h-[90px] w-auto opacity-90 transition-opacity hover:opacity-100"
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
