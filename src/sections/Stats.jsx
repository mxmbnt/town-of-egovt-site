const stats = [
  { value: '62', unit: 'K', label: 'Total People lived in our city' },
  { value: '4.8', unit: 'K', label: 'Square kilometres region covers' },
  { value: '32', unit: '%', label: 'Private & domestic garden land' },
  { value: '6', unit: 'th', label: 'Average Costs of Home Ownership' },
]

export default function Stats() {
  return (
    <section
      className="bg-accent bg-cover bg-bottom py-[95px]"
      style={{ backgroundImage: "url('/img/stats-pattern.jpg')" }}
    >
      <div className="mx-auto grid max-w-[1270px] grid-cols-2 gap-y-12 px-5 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center font-heading text-white">
            <div className="text-[44px] font-semibold leading-none sm:text-[50px]">
              {s.value}
              {s.unit}
            </div>
            <p className="mx-auto mt-6 max-w-[200px] text-[20px] leading-[1.3]">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
