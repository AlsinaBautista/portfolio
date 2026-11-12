import { Fragment } from "react";
import type { Locale } from "@/lib/i18n";
import { cv, type CvEntry } from "@/content/cv";

function Entry({ e, compact = false }: { e: CvEntry; compact?: boolean }) {
  if (compact) {
    return (
      <li className="cv-comp">
        <b>{e.title}</b>
        {e.period ? <span className="cv-mono"> · {e.period}</span> : null}
        {": "}
        {e.bullets.join(" ")}
      </li>
    );
  }
  return (
    <div className="cv-entry">
      <h3 className="cv-h3">
        <span>
          {e.title}
          {e.badge ? (
            <span className="cv-badge">
              <i aria-hidden /> {e.badge}
            </span>
          ) : null}
        </span>
        {e.period ? <span className="cv-mono cv-period">{e.period}</span> : null}
      </h3>
      {e.lead || e.place || e.href ? (
        <p className="cv-lead">
          {[e.lead, e.place].filter(Boolean).join(" · ")}
          {e.href ? (
            <>
              {e.lead || e.place ? " · " : ""}
              <a href={e.href.url}>{e.href.display}</a>
            </>
          ) : null}
        </p>
      ) : null}
      <ul className="cv-ul">
        {e.bullets.map((b) => (
          <li key={b.slice(0, 30)}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

/** Hoja A4 del CV: una columna, texto real y secciones en orden de lectura (ATS). Misma maquetación en pantalla e impresión. */
export default function CvSheet({ locale, hash }: { locale: Locale; hash: string }) {
  const d = cv[locale];
  const s = d.sections;
  return (
    <article className="cv-sheet" lang={locale} data-cv-hash={hash} data-testid="cv-sheet">
      <header className="cv-header">
        <h1 className="cv-name">{d.name}</h1>
        <p className="cv-headline">{d.headline}</p>
        <p className="cv-contacts cv-mono">
          {d.contacts.map((c, i) => (
            <Fragment key={c.label}>
              {i > 0 ? " · " : ""}
              <span>
                <a href={c.href}>{c.display}</a>
              </span>
            </Fragment>
          ))}
        </p>
      </header>

      <section>
        <h2 className="cv-h2">{s.profile}</h2>
        <p>{d.profile}</p>
      </section>

      <section>
        <h2 className="cv-h2">{s.education}</h2>
        {d.education.map((e) => (
          <Entry key={e.title} e={e} />
        ))}
      </section>

      <section>
        <h2 className="cv-h2">{s.projects}</h2>
        {d.projects.map((e) => (
          <Entry key={e.title} e={e} />
        ))}
      </section>

      <section>
        <h2 className="cv-h2">{s.competitions}</h2>
        <ul className="cv-ul cv-ul-tight">
          {d.competitions.map((e) => (
            <Entry key={e.title} e={e} compact />
          ))}
        </ul>
      </section>

      <section>
        <h2 className="cv-h2">{s.experience}</h2>
        {d.experience.map((e) => (
          <Entry key={e.title} e={e} />
        ))}
      </section>

      <section>
        <h2 className="cv-h2">{s.skills}</h2>
        <dl className="cv-skills">
          {d.skills.map((k) => (
            <div key={k.group}>
              <dt className="cv-mono">{k.group}</dt>
              <dd>{k.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="cv-foot">
        <section>
          <h2 className="cv-h2">{s.languages}</h2>
          <p>{d.languages}</p>
        </section>
        <section>
          <h2 className="cv-h2">{s.interests}</h2>
          <p>{d.interests}</p>
        </section>
      </div>
    </article>
  );
}
