import { Button } from '../components/ui.jsx'

export default function Mayor() {
  return (
    <section className="grid bg-navy lg:grid-cols-[531px_1fr]">
      <img src="/img/mayor.jpg" alt="Andrew Simmons, City Mayor" className="h-[420px] w-full object-cover object-right lg:h-full" />

      <div className="px-5 py-[90px] sm:px-[70px] lg:px-[130px] lg:py-[140px]">
        <div className="max-w-[565px]">
          <h2 className="text-[34px] font-medium leading-[1.3] !text-white sm:text-[40px]">
            88th mayor of the City EGovt, re-elected on Jun 1 2019.
          </h2>
          <p className="mt-10 text-[18px] leading-[1.45] text-[#8f9bb4]">
            Monocle ipsum dolor sit amet exclusive essential uniforms, classic K-pop Tsutaya Boeing 787 Ginza. Boeing
            787 vibrant Ginza Asia-Pacific non signature emerging Nordic Marylebone international smart cosy handson
            crafted bespoke tote bag boulevard. Mayor Andrew J. Simmons, an accomplished advocate for working people.
          </p>
          <p className="mt-16 text-[18px] leading-[1.35]">
            <span className="block text-accent">– Andrew Simmons,</span>
            <span className="text-[#a3adc2]">City Mayor</span>
          </p>
          <div className="mt-11 flex flex-wrap items-center gap-10">
            <Button variant="outlineBlue" className="ml-2.5 h-[50px] px-[18px] text-[18px]">
              About City Mayor
            </Button>
            <img src="/img/signature.png" alt="Signature" className="h-auto w-[150px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
