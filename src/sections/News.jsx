import { Button, Container, Icon, SectionHeading } from '../components/ui.jsx'

const posts = [
  { img: '/img/news/1.jpg', cats: 'City News, Community', title: 'List Of City Weekend Celebrations' },
  { img: '/img/news/2.jpg', cats: 'Devlopement', title: 'New Ustralian Economic Culture' },
  { img: '/img/news/3.jpg', cats: 'Devlopement', title: 'Metro Road Design Plan 2025' },
  { img: '/img/news/4.jpg', cats: 'Devlopement', title: 'New Industrial Boom 2025: Announcement' },
  { img: '/img/news/5.jpg', cats: 'Goverment', title: 'Urban Renewal Loans Available' },
  { img: '/img/news/6.jpg', cats: 'Culture', title: 'Environmental Sustainability' },
  { img: '/img/news/7.jpg', cats: 'Community', title: 'Summer Nights At The Library' },
  { img: '/img/news/8.jpg', cats: 'Tourism', title: 'Dalvan Museum Street Art View' },
]

export default function News() {
  return (
    <section className="bg-cloud py-[110px]">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <SectionHeading title="News and Publications" text="The news about recent activities for needed peoples." />
          <Button variant="outlineBlue" className="h-[50px] px-[19px] text-[18px]">
            More News
          </Button>
        </div>

        <div
          className="no-scrollbar mt-[70px] flex snap-x snap-mandatory gap-[30px] overflow-x-auto pb-10"
        >
          {posts.map((p) => (
            <article
              key={p.title}
              className="w-[85%] shrink-0 snap-start bg-white shadow-soft sm:w-[calc((100%-30px)/2)] lg:w-[calc((100%-60px)/3)]"
            >
              <div className="relative">
                <img src={p.img} alt="" className="aspect-[397/268] w-full object-cover" />
                <span className="absolute -bottom-[15px] left-[25px] bg-accent px-[10px] py-[3px] font-heading text-[17px] font-semibold text-white">
                  July 24, 2020
                </span>
              </div>
              <div className="px-[25px] pt-[33px] pb-[35px]">
                <div className="flex flex-wrap items-center gap-x-4 text-[16px]">
                  <span>In {p.cats}</span>
                  <span className="flex items-center gap-1.5">
                    <Icon.comment className="h-4 w-4" />
                    Comment off
                  </span>
                </div>
                <h3 className="mt-1 text-[24px] font-medium leading-[1.3] transition-colors hover:text-accent">
                  <a href="#">{p.title}</a>
                </h3>
                <a
                  href="#"
                  className="group mt-6 inline-flex items-center gap-2 font-heading text-[17px] text-ink hover:text-accent"
                >
                  Continue Reading
                  <Icon.arrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
