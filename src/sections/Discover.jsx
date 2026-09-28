import { Button } from '../components/ui.jsx'

export default function Discover() {
  return (
    <section
      className="relative bg-cover bg-center py-[110px] text-center"
      style={{ backgroundImage: "url('/img/discover-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#1b2a5a]/55" />
      <div className="relative px-5">
        <h2 className="mx-auto max-w-[540px] text-[40px] font-semibold leading-[1.2] !text-white sm:text-[50px]">
          Discover our lovely and vibrant city
        </h2>
        <p className="mt-5 text-[20px] text-white">
          Experience the Tradition, Great and the Natural Beauty of the City
        </p>
        <Button className="mt-11 h-[60px] px-[35px] text-[20px]">Explore City</Button>
      </div>
    </section>
  )
}
