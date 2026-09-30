import { Button, Container, Icon } from '../../../components/ui.jsx'

export default function Welcome() {
  return (
    <section className="py-[110px]">
      <Container className="grid items-start gap-[70px] lg:grid-cols-[615px_1fr]">
        <a href="#" className="group relative block overflow-hidden" aria-label="Play video">
          <img src="/img/video.jpg" alt="" className="aspect-[615/345] w-full object-cover" />
          <span className="absolute left-1/2 top-1/2 grid h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-accent text-accent transition-transform group-hover:scale-110">
            <Icon.play className="ml-1 h-7 w-7" />
          </span>
        </a>

        <div>
          <h2 className="text-[36px] font-semibold leading-[1.1] sm:text-[42px]">
            Welcome to Local Town Municipal Council
          </h2>
          <p className="mt-10 font-bold leading-[1.5] text-ink">
            Mayor Carnee Simmons is committed to solving problems for town people across the state under her
            leadership.
          </p>
          <p className="mt-8 leading-[1.5] text-ink">
            Monocle ipsum dolor sit amet exclusive essential uniforms, classic K-pop Tsutaya Boeing 787 Ginza. Boeing
            787 vibrant Ginza Asia-Pacific non signature emerging Nordic Marylebone international smart cosy handson
            crafted bespoke tote bag boulevard.
          </p>
          <Button variant="outlineBlue" className="mt-10 h-[50px] px-[30px] text-[18px]">
            Learn More
          </Button>
        </div>
      </Container>
    </section>
  )
}
