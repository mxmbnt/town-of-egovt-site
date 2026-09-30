import { useLocation } from "react-router-dom";
import A from "../../components/A.jsx";
import Blocks from "../../components/Blocks.jsx";
import {
  CommentForm,
  Pagination,
  PrevNext,
  ShareArticle,
  ShareIcons,
  SidebarWidgets,
} from "../../components/common.jsx";
import Feather from "../../components/Feather.jsx";
import { Container } from "../../components/ui.jsx";
import PageTitle from "../../layouts/PageTitle.jsx";
import { useDocumentTitle } from "../../layouts/SiteLayout.jsx";
import data from "../../data/posts.json";
import { useEntry } from "../../lib/useData.js";
import NotFound from "../NotFound.jsx";

function Cats({ categories, className = "text-ink" }) {
  return categories.map((c, k) => (
    <span key={c.href}>
      {k > 0 && ", "}
      <A href={c.href} className={`${className} hover:text-primary`}>
        {c.label}
      </A>
    </span>
  ));
}

// Méta complète : date · catégories · auteur · commentaires
export function PostMeta({ date, categories = [], author }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[16px]">
      {date && (
        <span className="flex items-center gap-2">
          <Feather name="clock" className="h-4 w-4 text-primary" />
          {date}
        </span>
      )}
      {categories.length > 0 && (
        <span>
          - In <Cats categories={categories} />
        </span>
      )}
      {author && (
        <span>
          By{" "}
          <A href="/author/admin/" className="text-ink hover:text-primary">
            {author}
          </A>
        </span>
      )}
      <span className="flex items-center gap-1.5 text-[14px]">
        <Feather name="message-square" className="h-3.5 w-3.5" />
        Comment off
      </span>
    </div>
  );
}

// Carte de grille : image, « In … · Comment off », titre, Continue Reading
function GridCard({ p }) {
  return (
    <article className="h-full bg-white shadow-card">
      {p.image && (
        <A href={p.href} className="block overflow-hidden">
          <img
            src={p.image}
            alt=""
            className="aspect-[600/406] w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </A>
      )}
      <div className="px-[25px] pb-[30px] pt-[18px]">
        <div className="flex flex-wrap items-center gap-x-3 text-[15px]">
          {p.categories.length > 0 && (
            <span>
              In <Cats categories={p.categories} className="text-body" />
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Feather name="message-square" className="h-3.5 w-3.5" />
            Comment off
          </span>
        </div>
        <h2 className="mt-1 font-heading text-[22px] font-medium leading-[1.3] text-ink">
          <A href={p.href} className="hover:text-primary">
            {p.title}
          </A>
        </h2>
        <A
          href={p.href}
          className="group mt-6 inline-flex items-center gap-2 font-heading text-[16px] text-ink hover:text-primary"
        >
          Continue Reading
          <Feather
            name="arrow-right"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </A>
      </div>
    </article>
  );
}

// Article en liste détaillée (mise en page « News Sidebar » et recherche)
function ListCard({ p, meta = true }) {
  return (
    <article className="bg-white shadow-card">
      {p.image && (
        <A href={p.href} className="block overflow-hidden">
          <img src={p.image} alt="" className="w-full object-cover" />
        </A>
      )}
      <div className="px-[35px] pb-[50px] pt-[60px]">
        {meta && <PostMeta {...p} />}
        <h2 className="mt-2 font-heading text-[30px] font-medium leading-tight text-ink">
          <A href={p.href} className="hover:text-primary">
            {p.title}
          </A>
        </h2>
        {p.excerpt && (
          <div
            className="rich mt-5 text-[18px] leading-7 [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: p.excerpt }}
          />
        )}
        <div className="mt-9 flex items-center justify-between">
          <A
            href={p.href}
            className="inline-flex items-center gap-2 bg-primary px-[22px] py-3 font-heading text-[18px] font-medium text-white transition-colors hover:bg-navy"
          >
            Continue Reading
            <Feather name="arrow-right" className="h-4 w-4" />
          </A>
          <span className="group relative">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[#e5e5e5] text-ink">
              <i className="fas fa-share-alt text-[15px]" />
            </span>
            <ShareIcons className="invisible absolute bottom-full right-0 mb-2 opacity-0 transition group-hover:visible group-hover:opacity-100" />
          </span>
        </div>
      </div>
    </article>
  );
}

function BlogPagination({ items }) {
  if (!items?.length) return null;
  return (
    <nav className="mt-[60px] flex justify-center">
      <ul className="flex gap-2.5">
        {items.map((p, k) => {
          const inner =
            p.kind === "next" ? (
              <i className="arrow_carrot-right text-[18px]" />
            ) : p.kind === "prev" ? (
              <i className="arrow_carrot-left text-[18px]" />
            ) : (
              p.label
            );
          const cls =
            "grid h-10 min-w-10 place-items-center rounded-[3px] px-2 font-heading text-[16px] transition-colors";
          return (
            <li key={k}>
              {p.current ? (
                <span className={`${cls} bg-primary text-white`}>{inner}</span>
              ) : (
                <A
                  href={p.href}
                  className={`${cls} bg-[#eeeeee] text-ink hover:bg-primary hover:text-white`}
                >
                  {inner}
                </A>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function WithBlogSidebar({ sidebar, children }) {
  if (!sidebar) return children;
  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <div className="min-w-0 lg:w-[850px]">{children}</div>
      <aside className="flex-1">
        <SidebarWidgets widgets={data.sidebar} />
      </aside>
    </div>
  );
}

export function BlogArchive() {
  const a = useEntry(data.archives);
  if (!a) return <NotFound />;
  const sidebar = a.layout === "layout_2r";
  const cols =
    a.template === "default"
      ? 1
      : a.template === "grid_sidebar"
        ? 2
        : a.template === "grid_medium"
          ? 3
          : sidebar
            ? 3
            : 4;
  const grid = {
    1: "space-y-[60px]",
    2: "grid gap-[30px] md:grid-cols-2",
    3: "grid gap-[30px] md:grid-cols-2 lg:grid-cols-3",
    4: "grid gap-[30px] sm:grid-cols-2 lg:grid-cols-4",
  }[cols];
  return (
    <Container className="pb-[110px] pt-[110px]">
      <WithBlogSidebar sidebar={sidebar}>
        <div className={`${grid} gap-y-[45px]`}>
          {a.cards.map((p) =>
            cols === 1 ? (
              <ListCard key={p.href + p.title} p={p} />
            ) : (
              <GridCard key={p.href + p.title} p={p} />
            ),
          )}
        </div>
        {a.cards.length === 0 && (
          <p className="text-center text-[18px]">
            {a.empty || "Nothing Found"}
          </p>
        )}
        <BlogPagination items={a.pagination} />
      </WithBlogSidebar>
    </Container>
  );
}

export function PostSingle() {
  const s = useEntry(data.singles);
  if (!s) return <NotFound />;
  return (
    <Container className="pb-[70px] pt-[110px]">
      <WithBlogSidebar sidebar>
        {s.image && <img src={s.image} alt="" className="w-full" />}
        <div className="mt-[60px]">
          <PostMeta {...s} />
        </div>
        <h1 className="mt-2 font-heading text-[36px] font-medium leading-tight text-ink">
          {s.title}
        </h1>
        <Blocks blocks={s.blocks} className="mt-6" />
        {s.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="font-heading text-[16px] text-ink">Tags:</span>
            {s.tags.map((t) => (
              <A
                key={t.href}
                href={t.href}
                className="border border-[#e5e5e5] px-3 py-0.5 text-[14px] transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                {t.label}
              </A>
            ))}
          </div>
        )}
        <div className="mt-10">
          <ShareArticle border={false} />
          <PrevNext prev={s.prev} next={s.next} all="/blog/" />
        </div>
        <CommentForm />
      </WithBlogSidebar>
    </Container>
  );
}

// ---------------------------------------------------------------- Recherche

// Tous les contenus recherchables, chargés à la demande avec la page de recherche
const sources = import.meta.glob(
  "../../data/{posts,events,services,departments,docs,portfolio,shop}.json",
  { eager: true },
);

// Texte brut des blocs, en ignorant les fragments trop courts (lettrines…)
function plainText(blocks = []) {
  return blocks
    .flatMap((b) =>
      b.t === "html"
        ? [b.html.replace(/<[^>]+>/g, "")]
        : b.t === "row"
          ? b.cols.map((c) => plainText(c.blocks))
          : b.t === "group"
            ? [plainText(b.blocks)]
            : [],
    )
    .filter((t) => t.trim().length > 20)
    .join(" ");
}

function firstText(blocks) {
  const t = plainText(blocks);
  return t ? t.slice(0, 260) + " […]" : "";
}

function searchAll(q) {
  const needle = q.toLowerCase();
  const out = [];
  for (const mod of Object.values(sources)) {
    const singles = (mod.default || mod).singles || {};
    for (const [href, s] of Object.entries(singles)) {
      const title = s.title || s.name || "";
      const text = firstText(s.blocks);
      if (
        title.toLowerCase().includes(needle) ||
        text.toLowerCase().includes(needle)
      ) {
        out.push({
          href,
          title,
          image: s.image || s.images?.[0] || s.gallery?.[0],
          excerpt: text && `<p>${text}</p>`,
        });
      }
    }
  }
  return out;
}

export function SearchResults() {
  const { search } = useLocation();
  const q = new URLSearchParams(search).get("s") || "";
  const captured = data.archives[`/?s=${q}`];
  const results = captured ? captured.cards : searchAll(q);
  useDocumentTitle(`You searched for ${q} - EGovt`);
  return (
    <>
      <PageTitle
        title="Search"
        bg="/wp/2020/08/1.jpg"
        crumbs={[
          { label: "Home", href: "/" },
          { label: `Search results for "${q}"` },
        ]}
      />
      <Container className="pb-[110px] pt-[110px]">
        {results.length ? (
          <div className="space-y-[60px]">
            {results.map((p) => (
              <ListCard key={p.href + p.title} p={p} meta={false} />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="font-heading text-[36px] font-medium text-ink">
              Nothing Found
            </h2>
            <p className="mt-4 text-[18px]">
              Sorry, but nothing matched your search terms. Please try again
              with some different keywords.
            </p>
          </div>
        )}
        {captured && <BlogPagination items={captured.pagination} />}
      </Container>
    </>
  );
}
