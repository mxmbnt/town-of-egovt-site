import { Container, Icon, SectionHeading } from '../../../components/ui.jsx'

const events = [
  {
    day: '02',
    month: 'JANUARY',
    weekday: 'SATURDAY',
    title: 'The Strategically Build Your Business',
    date: 'January 2, 2021 @ 15:00 - 19:00',
    place: '32 Quincy Street, Cambridge, MA',
  },
  {
    day: '19',
    month: 'APRIL',
    weekday: 'MONDAY',
    title: 'The International Coffee Festival 2021',
    date: 'April 19, 2021 @ 09:30 - 13:00',
    place: '15 Champions Center, Crewey',
  },
  {
    day: '10',
    month: 'FEBRUARY',
    weekday: 'WEDNESDAY',
    title: 'The Financial Freedom Boot Camp 2020',
    date: 'February 10, 2021 @ 15:00 - 19:00',
    place: 'Millenia Orlando, USA',
  },
]

export default function Events() {
  return (
    <section className="bg-cloud py-[100px]">
      <Container>
        <SectionHeading
          center
          title="Events & Programs"
          text="What's are going to happen in city upcoming days. Join the fun in our city!"
        />

        <div className="mt-[70px] grid gap-[30px] md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <article key={e.title} className="bg-white px-[25px] pt-5 pb-10 shadow-card">
              <div className="border-b border-[#e9e9ee] pb-5 font-heading">
                <div className="flex items-end gap-2.5">
                  <span className="text-[46px] leading-none text-accent">{e.day}</span>
                  <span className="pb-1 text-[15px] font-medium text-ink">{e.month}</span>
                </div>
                <div className="text-[20px] font-semibold text-body">{e.weekday}</div>
              </div>
              <h3 className="mt-7 text-[24px] font-medium leading-[1.15] transition-colors hover:text-accent">
                <a href="#">{e.title}</a>
              </h3>
              <ul className="mt-4 space-y-2 text-[17px]">
                <li className="flex items-center gap-2">
                  <Icon.clock className="h-[18px] w-[18px] shrink-0 text-accent" />
                  {e.date}
                </li>
                <li className="flex items-center gap-2">
                  <Icon.pin className="h-[18px] w-[18px] shrink-0 text-accent" />
                  {e.place}
                </li>
              </ul>
              <a
                href="#"
                className="mt-8 inline-block border-2 border-line px-5 py-1.5 font-heading text-[16px] font-medium text-ink transition-colors hover:border-accent hover:bg-accent hover:text-white"
              >
                More Details
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
