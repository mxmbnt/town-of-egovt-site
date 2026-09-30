import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import A from '../../components/A.jsx'
import { Pagination, Price, SidebarWidgets } from '../../components/common.jsx'
import { Container } from '../../components/ui.jsx'
import data from '../../data/shop.json'
import { useEntry } from '../../lib/useData.js'
import NotFound from '../NotFound.jsx'

// ---------------------------------------------------------------- Panier (mémorisé dans le navigateur)

const KEY = 'egovt-cart'
function readCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}
function writeCart(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    /* stockage indisponible : le panier reste en mémoire */
  }
  window.dispatchEvent(new Event('egovt-cart'))
}
export function useCart() {
  const [items, setItems] = useState(readCart)
  useEffect(() => {
    const sync = () => setItems(readCart())
    window.addEventListener('egovt-cart', sync)
    return () => window.removeEventListener('egovt-cart', sync)
  }, [])
  const add = (p, qty = 1) => {
    const cur = readCart()
    const i = cur.findIndex((x) => x.href === p.href)
    if (i >= 0) cur[i].qty += qty
    else cur.push({ href: p.href, title: p.title, image: p.image || p.images?.[0], price: p.price, qty })
    writeCart(cur)
  }
  const setQty = (href, qty) => writeCart(readCart().map((x) => (x.href === href ? { ...x, qty } : x)).filter((x) => x.qty > 0))
  const clear = () => writeCart([])
  return { items, add, setQty, clear }
}
const amount = (p) => parseFloat(String(p).replace(/[^0-9.]/g, '')) || 0
const money = (n) => `£${n.toFixed(2)}`

// ---------------------------------------------------------------- Liste

function ProductCard({ p }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  return (
    <div className="group text-center">
      <div className="relative overflow-hidden bg-[#eee]">
        {p.sale && <span className="absolute left-2.5 top-2.5 z-10 bg-[#77a464] px-2 py-0.5 text-[12px] font-bold text-white">SALE!</span>}
        <A href={p.href}>
          <img src={p.image} alt={p.title} className="aspect-square w-full object-cover" />
        </A>
        <button
          onClick={() => {
            add(p)
            setAdded(true)
          }}
          className="absolute inset-x-0 bottom-0 translate-y-full bg-primary py-3 font-heading text-[15px] font-medium uppercase text-white transition-transform group-hover:translate-y-0"
        >
          {added ? 'Added to cart' : p.button || 'Add to cart'}
        </button>
      </div>
      <h2 className="mt-5 font-heading text-[18px] font-medium text-ink">
        <A href={p.href} className="hover:text-primary">
          {p.title}
        </A>
      </h2>
      <Price price={p.price} regular={p.regular} className="mt-1 block text-[18px] !text-body [&_ins]:underline [&_ins]:decoration-1" />
      {added && (
        <Link to="/cart/" className="mt-1 block text-[14px] text-link">
          View cart
        </Link>
      )}
    </div>
  )
}

function ShopLayout({ children, archive = false }) {
  const widgets = data.sidebar || []
  return (
    <Container className="pb-[110px] pt-[110px]">
      <div className="flex flex-col gap-10 lg:flex-row">
        <aside className="order-2 w-full shrink-0 lg:order-1 lg:w-[322px]">
          <SidebarWidgets widgets={archive ? [...widgets.slice(0, 2), { t: 'priceFilter' }, ...widgets.slice(2)] : widgets} />
        </aside>
        <div className="order-1 min-w-0 flex-1 lg:order-2">{children}</div>
      </div>
    </Container>
  )
}

export function ShopArchive() {
  const a = useEntry(data.archives)
  const [order, setOrder] = useState(0)
  if (!a) return <NotFound />
  const cards = [...a.cards]
  if (order === 4) cards.sort((x, y) => amount(x.price) - amount(y.price))
  if (order === 5) cards.sort((x, y) => amount(y.price) - amount(x.price))
  return (
    <ShopLayout archive>
      {cards.length ? (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[16px]">{a.count}</p>
            <select value={order} onChange={(e) => setOrder(+e.target.value)} className="border border-[#ccc] px-2 py-1 text-[15px]">
              {a.orderby.map((o, k) => (
                <option key={o} value={k}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-x-[30px] gap-y-[50px] sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((p) => (
              <ProductCard key={p.href} p={p} />
            ))}
          </div>
          <Pagination items={a.pagination} />
        </>
      ) : (
        <p className="border-t-[3px] border-link bg-[#f7f6f7] px-6 py-4 text-[16px]">No products were found matching your selection.</p>
      )}
    </ShopLayout>
  )
}


// ---------------------------------------------------------------- Fiche produit

export function ProductSingle() {
  const s = useEntry(data.singles)
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState(0)
  const [msg, setMsg] = useState(false)
  const [img, setImg] = useState(0)
  if (!s) return <NotFound />
  return (
    <ShopLayout>
      {msg && (
        <div className="mb-8 flex items-center justify-between border-t-[3px] border-[#8fae1b] bg-[#f7f6f7] px-6 py-4 text-[16px]">
          “{s.title}” has been added to your cart.
          <Link to="/cart/" className="bg-[#ebe9eb] px-4 py-2 font-heading text-ink">
            View cart
          </Link>
        </div>
      )}
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="relative bg-[#eee]">
            {s.sale && <span className="absolute left-2.5 top-2.5 bg-[#77a464] px-2 py-0.5 text-[12px] font-bold text-white">SALE!</span>}
            <img src={s.images[img]} alt={s.title} className="w-full" />
          </div>
          {s.images.length > 1 && (
            <div className="mt-2.5 grid grid-cols-4 gap-2.5">
              {s.images.map((src, k) => (
                <button key={src} onClick={() => setImg(k)} className={k === img ? 'opacity-100' : 'opacity-60 hover:opacity-100'}>
                  <img src={src} alt="" className="w-full" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="font-heading text-[24px] font-medium text-ink">{s.title}</h1>
          <Price price={s.price} regular={s.regular} className="mt-2 block text-[18px] !text-body" />
          <div className="rich mt-5 text-[16px] leading-6 [&_p]:m-0" dangerouslySetInnerHTML={{ __html: s.short }} />
          {s.stock && <p className="mt-2 text-[15px] text-link">{s.stock}</p>}
          <form
            className="mt-4 flex gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              add(s, qty)
              setMsg(true)
            }}
          >
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, +e.target.value))}
              className="h-[50px] w-[80px] border border-[#e0e0e0] text-center text-ink"
              aria-label="Quantité"
            />
            <button className="h-[50px] bg-primary px-[54px] font-heading text-[16px] font-medium uppercase text-white transition-colors hover:bg-navy">
              Add to cart
            </button>
          </form>
          <div className="mt-8 space-y-1 text-[15px]">
            <p>
              <span className="font-heading uppercase text-ink">{s.catLabel}:</span>{' '}
              {s.categories.map((c, k) => (
                <span key={c.href}>
                  {k > 0 && ', '}
                  <A href={c.href} className="hover:text-primary">
                    {c.label}
                  </A>
                </span>
              ))}
            </p>
            {s.tagLabel && (
              <p>
                <span className="font-heading uppercase text-ink">{s.tagLabel}:</span>{' '}
                {s.tags.map((c, k) => (
                  <span key={c.href}>
                    {k > 0 && ', '}
                    <A href={c.href} className="hover:text-primary">
                      {c.label}
                    </A>
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-[60px]">
        <div className="flex">
          {s.tabs.map((t, k) => (
            <button
              key={t}
              onClick={() => setTab(k)}
              className={`-mb-px border px-6 py-3 font-heading text-[18px] text-ink ${
                k === tab ? 'border-[#e5e5e5] border-b-white border-t-2 border-t-primary bg-white' : 'border-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="border border-[#e5e5e5] px-6 py-8 text-[16px]">
          {tab === 0 ? (
            <div className="rich [&_p]:m-0" dangerouslySetInnerHTML={{ __html: s.description }} />
          ) : (
            <div>
              <h2 className="font-heading text-[22px] text-ink">Reviews</h2>
              <p className="mt-2">There are no reviews yet.</p>
              <p className="mt-4">
                Be the first to review “{s.title}”. You must be{' '}
                <A href="/my-account/" className="text-link">
                  logged in
                </A>{' '}
                to post a review.
              </p>
            </div>
          )}
        </div>
      </div>

      {s.related.length > 0 && (
        <div className="mt-[60px]">
          <h2 className="mb-8 font-heading text-[26px] font-medium text-ink">{s.relatedTitle}</h2>
          <div className="grid gap-[30px] sm:grid-cols-3">
            {s.related.map((p) => (
              <ProductCard key={p.href} p={p} />
            ))}
          </div>
        </div>
      )}
    </ShopLayout>
  )
}

// ---------------------------------------------------------------- Panier et commande

function EmptyCart() {
  return (
    <>
      <p className="flex items-center gap-4 border-t-[3px] border-link bg-[#f5f5f7] px-6 py-5 text-[17px]">
        <i className="far fa-window-maximize text-[18px] text-link" />
        Your cart is currently empty.
      </p>
      <Link to="/shop/" className="mt-8 inline-block rounded-[3px] bg-[#ebe9eb] px-4 py-2 font-heading text-[17px] font-medium text-[#515151] hover:bg-[#dfdcde]">
        Return to shop
      </Link>
    </>
  )
}

export function Cart() {
  const { items, setQty } = useCart()
  const total = items.reduce((t, x) => t + amount(x.price) * x.qty, 0)
  return (
    <Container className="pb-[110px] pt-[110px]">
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <table className="w-full border border-[#e5e5e5] text-left text-[16px]">
            <thead className="font-heading text-ink">
              <tr className="border-b border-[#e5e5e5]">
                <th className="p-4" />
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.href} className="border-b border-[#e5e5e5]">
                  <td className="p-4">
                    <button onClick={() => setQty(x.href, 0)} className="text-[20px] text-primary" aria-label="Retirer">
                      ×
                    </button>
                  </td>
                  <td className="p-4">
                    <A href={x.href} className="flex items-center gap-4 text-ink hover:text-primary">
                      <img src={x.image} alt="" className="h-16 w-16 object-cover" />
                      {x.title}
                    </A>
                  </td>
                  <td className="p-4">{x.price}</td>
                  <td className="p-4">
                    <input type="number" min={0} value={x.qty} onChange={(e) => setQty(x.href, +e.target.value)} className="w-16 border border-[#e0e0e0] p-1 text-center" />
                  </td>
                  <td className="p-4">{money(amount(x.price) * x.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ml-auto mt-10 max-w-[420px]">
            <h2 className="font-heading text-[26px] font-medium text-ink">Cart totals</h2>
            <div className="mt-4 flex justify-between border-y border-[#e5e5e5] py-3 text-[17px]">
              <span className="font-heading text-ink">Total</span>
              <strong className="text-ink">{money(total)}</strong>
            </div>
            <Link to="/checkout/" className="mt-5 block bg-primary py-4 text-center font-heading text-[18px] text-white hover:bg-navy">
              Proceed to checkout
            </Link>
          </div>
        </>
      )}
    </Container>
  )
}

export function Checkout() {
  const { items, clear } = useCart()
  const [done, setDone] = useState(false)
  const total = items.reduce((t, x) => t + amount(x.price) * x.qty, 0)
  const field = 'w-full border border-[#e0e0e0] px-4 py-2.5 text-[16px] text-ink outline-none focus:border-primary'
  if (done) {
    return (
      <Container className="pb-[110px] pt-[110px] text-center">
        <p className="text-[20px] text-ink">Thank you. Your order has been received.</p>
      </Container>
    )
  }
  return (
    <Container className="pb-[110px] pt-[110px]">
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <form
          className="grid gap-12 lg:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            clear()
            setDone(true)
          }}
        >
          <div className="space-y-4">
            <h2 className="font-heading text-[26px] font-medium text-ink">Billing details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="First name *" className={field} />
              <input required placeholder="Last name *" className={field} />
            </div>
            <input placeholder="Company name (optional)" className={field} />
            <input required placeholder="Street address *" className={field} />
            <input required placeholder="Town / City *" className={field} />
            <input required placeholder="Postcode / ZIP *" className={field} />
            <input required placeholder="Phone *" className={field} />
            <input required type="email" placeholder="Email address *" className={field} />
            <textarea rows={4} placeholder="Order notes (optional)" className={field} />
          </div>
          <div>
            <h2 className="font-heading text-[26px] font-medium text-ink">Your order</h2>
            <table className="mt-4 w-full border border-[#e5e5e5] text-[16px]">
              <tbody>
                {items.map((x) => (
                  <tr key={x.href} className="border-b border-[#e5e5e5]">
                    <td className="p-4">
                      {x.title} × {x.qty}
                    </td>
                    <td className="p-4 text-right">{money(amount(x.price) * x.qty)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="p-4 font-heading text-ink">Total</td>
                  <td className="p-4 text-right font-bold text-ink">{money(total)}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 bg-[#f7f6f7] p-4 text-[15px]">Cash on delivery. Pay with cash upon delivery.</p>
            <button className="mt-5 w-full bg-primary py-4 font-heading text-[18px] text-white hover:bg-navy">Place order</button>
          </div>
        </form>
      )}
    </Container>
  )
}

// ---------------------------------------------------------------- Compte

export function MyAccount() {
  const [tab, setTab] = useState('login')
  const [sent, setSent] = useState(false)
  const field = 'mt-2 w-full rounded-[3px] border border-[#ddd] px-3 py-1.5 text-[16px] text-ink outline-none focus:border-primary'
  const label = (t) => (
    <>
      {t} <span className="text-primary">*</span>
    </>
  )
  return (
    <div className="mx-auto max-w-[450px] px-5 pb-[110px] pt-[110px]">
      <div className="flex justify-center gap-6">
        {[
          ['login', 'Login'],
          ['register', 'Register'],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => {
              setTab(k)
              setSent(false)
            }}
            className={`border-b-2 pb-1 font-heading text-[24px] text-ink ${tab === k ? 'border-primary' : 'border-transparent'}`}
          >
            {l}
          </button>
        ))}
      </div>
      <form
        className="mt-10 space-y-5 text-[17px]"
        onSubmit={(e) => {
          e.preventDefault()
          setSent(true)
        }}
      >
        {tab === 'login' ? (
          <>
            <label className="block">
              {label('Username or email address')}
              <input required className={field} />
            </label>
            <label className="block">
              {label('Password')}
              <input required type="password" className={field} />
            </label>
            <div className="flex justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/my-account/lost-password/" className="hover:text-primary">
                Lost your password?
              </Link>
            </div>
          </>
        ) : (
          <>
            <label className="block">
              {label('Email address')}
              <input required type="email" className={field} />
            </label>
            <p className="text-[15px]">A link to set a new password will be sent to your email address.</p>
          </>
        )}
        <button className="h-[50px] w-full bg-primary font-heading text-[20px] font-medium text-white hover:bg-navy">
          {tab === 'login' ? 'Log in' : 'Register'}
        </button>
        {sent && <p className="text-center text-[15px] text-ink">Ceci est une démo : aucun compte n'est créé.</p>}
      </form>
    </div>
  )
}

export function LostPassword() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)
  return (
    <div className="mx-auto max-w-[600px] px-5 pb-[110px] pt-[110px] text-[17px]">
      {sent ? (
        <p className="border-t-[3px] border-link bg-[#f7f6f7] px-6 py-4">Password reset email has been sent.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
          className="space-y-5"
        >
          <p>Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.</p>
          <label className="block">
            Username or email <span className="text-primary">*</span>
            <input required className="mt-2 w-full rounded-[3px] border border-[#ddd] px-3 py-1.5 text-ink outline-none focus:border-primary" />
          </label>
          <div className="flex gap-4">
            <button className="bg-primary px-6 py-3 font-heading text-white hover:bg-navy">Reset password</button>
            <button type="button" onClick={() => navigate('/my-account/')} className="text-[15px] hover:text-primary">
              Back to login
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
