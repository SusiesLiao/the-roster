// src/pages/Apply.tsx
// The Roster — application survey page.
// Serves BOTH routes:
//   /apply           → kind="concierge"  (Concierge application)
//   /suggest-a-role  → kind="role"       (Train this role next)
//
// Replaces the two mailto: CTAs on the homepage. No mail client involved.
// Posts straight to public.concierge_applications in Supabase (insert-only RLS).
//
// PALETTE: light. Cream surface, navy ink. No dark backgrounds anywhere — house rule.

import { useState } from "react";

const SUPABASE_URL = "https://erulkblczpqblbuxllvz.supabase.co";
// Publishable (anon) key — safe in client bundles by design. Insert-only RLS,
// no SELECT policy, so nobody can read applications back with it.
const SUPABASE_KEY = "sb_publishable_5x2m281Fj-aIRTeCuVMkoA_j0sGeWvS";

type Kind = "concierge" | "role" | "founding";

/* ------------------------------------------------------------------ config */

const CONCIERGE = {
  eyebrow: "Concierge",
  title: ["Tell us what's ", "breaking", "."],
  lede: "Five families at a time, by application only. Two minutes — mostly tick boxes.",
  meta: "No blank page. No “what do I even write.”",
  submitLabel: "Submit application",
  foot: "Five places. We read every one.",
  subject: "Concierge application",
};

/* The founding claim. Same question set as Concierge on purpose — what is
   eating your week, which portals, what you would hand over first — because
   that IS the onboarding interview, captured while they are warm. The mailto
   this replaced got us a name and an address; this gets us the shape of the
   household before the first conversation. */
const FOUNDING = {
  eyebrow: "Founding eight",
  title: ["Claim a ", "founding", " spot."],
  lede: "Eight households this month, $39/mo locked in for as long as you stay. Two minutes — mostly tick boxes.",
  meta: "No card now. We reply within two working days with your invite.",
  submitLabel: "Claim my spot",
  foot: "Eight places. First come, properly served.",
  subject: "Founding spot claim",
};

const ROLE = {
  eyebrow: "Suggest a role",
  title: ["Who would you ", "hire", " tomorrow?"],
  lede: "Tell us the role you'd put on your roster and we'll tell you if we can train it.",
  meta: "Tick boxes, not essays.",
  submitLabel: "Send it over",
  foot: "We read every suggestion. Some become talent.",
  subject: "Train this role next",
};

const PAIN = [
  "School portals & newsletters",
  "Kids' schedules & logistics",
  "Household admin & bills",
  "Appointments & bookings",
  "Travel & holiday planning",
  "An inbox that never empties",
];

const PORTALS = [
  "Seesaw",
  "School portal or parent site",
  "WeChat class groups",
  "WhatsApp groups",
  "Email newsletters",
  "Google Calendar",
  "Outlook",
];

const AGES = ["Under 5", "5–11", "12–18", "No kids at home"];
const HOURS = ["Under 2 hours", "2–5 hours", "5–10 hours", "10+ hours"];
const CHANNELS = ["WhatsApp", "WeChat", "Telegram", "Email is fine"];

const ROLES_WANTED = [
  "Bookkeeper / invoices",
  "Inbox triage",
  "Listings or CRM manager",
  "Scheduling & bookings",
  "Research & summaries",
  "Social / content drafting",
  "Customer replies",
];

const WORTH = ["Under $39/mo", "$39–$99/mo", "$100–$299/mo", "$300+/mo"];

/* ------------------------------------------------------------------ styles */

const CSS = `
.rp{/* was a hardcoded copy of the old navy; the palette lives in styles.css now.
     No hex here on purpose - the guard reads comments, and a stale value quoted
     in one is the one that gets pasted back in. */
  --deep:var(--emphasis);--cream:#F4F5F2;--blue:#7C9BB7;--gold:#C9A961;
  --line:rgba(52,68,85,.18);--muted:#4A5568;--faint:#5C6880;--goldink:#9A7C34;
  background:var(--cream);color:var(--deep);min-height:100vh;
  font-family:'Schibsted Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-weight:400;line-height:1.62}
.rp *{box-sizing:border-box}
.rp .wrap{max-width:640px;margin:0 auto;padding:56px 24px 96px}
.rp .logo{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:22px;letter-spacing:.02em;
  color:var(--deep);text-decoration:none;display:inline-block;margin-bottom:48px}
.rp .logo em{font-style:italic;color:var(--blue)}
.rp .eyebrow{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin:0 0 14px;font-weight:500}
.rp h1{font-family:'Fraunces',Georgia,serif;font-weight:500;font-size:34px;line-height:1.12;margin:0 0 16px;letter-spacing:-.01em;color:var(--deep)}
.rp h1 em{font-style:italic;color:var(--blue)}
.rp .lede{font-size:17px;color:var(--muted);margin:0 0 8px;max-width:52ch;line-height:1.6}
.rp .meta{font-size:14px;color:var(--faint);margin:0 0 44px}
.rp .rule{height:1px;background:var(--line);border:0;margin:0 0 40px}

.rp .compare{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 40px}
.rp .card{border:1px solid var(--line);border-radius:3px;padding:20px 20px 22px;background:#fff}
.rp .card.hero{border-color:var(--gold);background:rgba(201,169,97,.07)}
.rp .card .tier{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--faint);margin:0 0 3px;font-weight:600}
.rp .card.hero .tier{color:var(--goldink)}
.rp .card .price{font-family:'Fraunces',Georgia,serif;font-size:27px;font-weight:600;margin:0 0 10px;line-height:1.15}
.rp .card .price small{font-size:15px;font-weight:400}
.rp .card p.body{font-size:15px;color:var(--muted);margin:0;line-height:1.62}
.rp .card .who{font-size:13.5px;color:var(--deep);margin:12px 0 0;font-weight:500}
.rp .verdict{font-size:15.5px;color:var(--muted);margin:0 0 40px;padding-left:14px;border-left:2px solid var(--gold);line-height:1.65}
.rp .verdict strong{color:var(--deep);font-weight:600}

.rp fieldset{border:0;margin:0 0 38px;padding:0}
.rp legend{font-family:'Fraunces',Georgia,serif;font-size:23px;font-weight:600;color:var(--deep);padding:0;margin:0 0 4px;line-height:1.3}
.rp .hint{font-size:13.5px;color:var(--faint);margin:0 0 16px;letter-spacing:.02em}
.rp .opt{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;margin-bottom:8px;
  border:1px solid var(--line);border-radius:3px;cursor:pointer;transition:border-color .15s,background .15s;background:#fff}
.rp .opt:hover{border-color:rgba(124,155,183,.75)}
.rp .opt input{appearance:none;-webkit-appearance:none;width:17px;height:17px;margin:3px 0 0;flex:0 0 17px;
  border:1.5px solid rgba(24,34,56,.42);background:#fff;cursor:pointer;position:relative;transition:all .15s}
.rp .opt input[type=radio]{border-radius:50%}
.rp .opt input:checked{background:var(--gold);border-color:var(--gold)}
.rp .opt input[type=checkbox]:checked::after{content:'';position:absolute;left:5px;top:1px;width:4px;height:9px;
  border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}
.rp .opt input[type=radio]:checked::after{content:'';position:absolute;left:4px;top:4px;width:7px;height:7px;border-radius:50%;background:#fff}
.rp .opt.on{border-color:var(--gold);background:rgba(201,169,97,.11)}
.rp .opt span{font-size:16px;color:var(--deep);line-height:1.5}
.rp label.field{display:block;margin-bottom:18px}
.rp label.field .lbl{display:block;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:7px;font-weight:500}
.rp input[type=text],.rp input[type=email],.rp textarea{width:100%;background:#fff;color:var(--deep);
  border:1px solid var(--line);border-radius:3px;padding:13px 14px;font-family:inherit;font-size:16px;font-weight:400;transition:border-color .15s,box-shadow .15s}
.rp input:focus,.rp textarea:focus{outline:0;border-color:var(--blue);box-shadow:0 0 0 3px rgba(124,155,183,.18)}
.rp textarea{resize:vertical;min-height:82px;line-height:1.55}
.rp ::placeholder{color:#8A93A6}
.rp .inline-other{margin:4px 0 8px 29px;max-width:340px}
.rp .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:520px){.rp .grid2,.rp .compare{grid-template-columns:1fr}.rp h1{font-size:32px}.rp .wrap{padding:36px 20px 80px}}
.rp button.submit{width:100%;background:var(--deep);color:var(--cream);border:0;border-radius:3px;padding:17px;
  font-family:'Inter',sans-serif;font-size:14px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:opacity .15s;margin-top:8px}
.rp button.submit:hover{opacity:.87}
.rp button.submit:disabled{opacity:.4;cursor:default}
.rp .foot{font-size:13.5px;color:var(--faint);text-align:center;margin-top:18px;line-height:1.6}
.rp .err{border:1px solid rgba(201,169,97,.7);background:rgba(201,169,97,.12);border-radius:3px;
  padding:14px 16px;font-size:14px;margin-top:18px;color:var(--deep)}
.rp .err a{color:var(--goldink)}
.rp .done{text-align:center;padding:70px 0 40px}
.rp .tick{width:52px;height:52px;border:1px solid var(--gold);border-radius:50%;margin:0 auto 26px;position:relative}
.rp .tick::after{content:'';position:absolute;left:19px;top:14px;width:9px;height:19px;
  border:solid var(--gold);border-width:0 1.5px 1.5px 0;transform:rotate(45deg)}
.rp .done h2{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:32px;margin:0 0 12px;color:var(--deep)}
.rp .done h2 em{font-style:italic;color:var(--blue)}
.rp .done p{color:var(--muted);font-size:16px;max-width:38ch;margin:0 auto 10px}
.rp .back{color:var(--goldink);font-size:13px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;font-weight:500}
`;

/* --------------------------------------------------------------- component */

type Props = { kind?: Kind };

export default function Apply({ kind = "concierge" }: Props) {
  const copy = kind === "role" ? ROLE : kind === "founding" ? FOUNDING : CONCIERGE;

  const [pain, setPain] = useState<string[]>([]);
  const [painOther, setPainOther] = useState("");
  const [painOtherOn, setPainOtherOn] = useState(false);
  const [portals, setPortals] = useState<string[]>([]);
  const [portalOther, setPortalOther] = useState("");
  const [portalOtherOn, setPortalOtherOn] = useState(false);
  const [ages, setAges] = useState<string[]>([]);
  const [hours, setHours] = useState("");
  const [oneThing, setOneThing] = useState("");

  const [rolesWanted, setRolesWanted] = useState<string[]>([]);
  const [roleOther, setRoleOther] = useState("");
  const [roleOtherOn, setRoleOtherOn] = useState(false);
  const [roleTakesOff, setRoleTakesOff] = useState("");
  const [worth, setWorth] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState("Email is fine");
  const [handle, setHandle] = useState("");

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const withOther = (list: string[], on: boolean, text: string) =>
    on && text.trim() ? [...list, text.trim()] : list;

  function buildPayload() {
    return {
      kind,
      name: name.trim() || null,
      email: email.trim() || null,
      contact_channel: channel,
      contact_handle: handle.trim() || null,
      pain_points: withOther(pain, painOtherOn, painOther),
      portals: withOther(portals, portalOtherOn, portalOther),
      kids_ages: ages.join(", ") || null,
      hours_per_week: hours || null,
      one_thing: oneThing.trim() || null,
      role_wanted: withOther(rolesWanted, roleOtherOn, roleOther).join(", ") || null,
      role_takes_off: roleTakesOff.trim() || null,
      role_worth: worth || null,
      source: "web",
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 300) : null,
    };
  }

  // Last-resort escape hatch if the POST fails (offline, blocked, outage).
  // Answers are already written into the body — never a blank email.
  function mailtoFallback(p: ReturnType<typeof buildPayload>) {
    const L =
      kind === "role"
        ? [
            "Hi - here's a role I'd hire tomorrow:",
            "",
            "Role: " + (p.role_wanted || "-"),
            "What they'd take off my plate: " + (p.role_takes_off || "-"),
            "What it'd be worth monthly: " + (p.role_worth || "-"),
            "",
            "Name: " + (p.name || "-"),
            "Email: " + (p.email || "-"),
            "Reach me on: " + p.contact_channel + " " + (p.contact_handle || ""),
            "",
            "Thanks,",
          ]
        : [
            "Hi - I'd like to apply for a Concierge place.",
            "",
            "What's eating my week: " + (p.pain_points.join(", ") || "-"),
            "Portals I'm juggling: " + (p.portals.join(", ") || "-"),
            "Kids' ages: " + (p.kids_ages || "-"),
            "Hours a week this costs me: " + (p.hours_per_week || "-"),
            "One thing I'd hand over tomorrow: " + (p.one_thing || "-"),
            "",
            "Name: " + (p.name || "-"),
            "Email: " + (p.email || "-"),
            "Reach me on: " + p.contact_channel + " " + (p.contact_handle || ""),
            "",
            "Thanks,",
          ];
    return (
      "mailto:hello@theroster.studio?subject=" +
      encodeURIComponent(copy.subject) +
      "&body=" +
      encodeURIComponent(L.join("\r\n"))
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    const payload = buildPayload();
    try {
      const res = await fetch(SUPABASE_URL + "/rest/v1/concierge_applications", {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(mailtoFallback(payload));
    } finally {
      setSending(false);
    }
  }

  const Opt = ({
    type,
    checked,
    onChange,
    label,
  }: {
    type: "checkbox" | "radio";
    checked: boolean;
    onChange: () => void;
    label: string;
  }) => (
    <label className={"opt" + (checked ? " on" : "")}>
      <input type={type} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );

  if (done) {
    return (
      <div className="rp">
        <style>{CSS}</style>
        <div className="wrap">
          <a className="logo" href="/">
            The <em>Roster</em>
          </a>
          <div className="done">
            <div className="tick" />
            <h2>
              We've got <em>it</em>.
            </h2>
            <p>
              {kind === "role"
                ? "Your suggestion is in. If we train this role, you'll be the first to know."
                : kind === "founding"
                  ? "Your spot is held. Your invite comes back within two working days — from a real person, not a bot — and your rate is locked from the day you start."
                  : "Your application is in. We read every one and reply within two working days — from a real person, not a bot."}
            </p>
            <p style={{ marginTop: 22 }}>
              <a className="back" href="/">
                &larr; Back to The Roster
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rp">
      <style>{CSS}</style>
      <div className="wrap">
        <a className="logo" href="/">
          The <em>Roster</em>
        </a>

        <form onSubmit={submit}>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>
            {copy.title[0]}
            <em>{copy.title[1]}</em>
            {copy.title[2]}
          </h1>
          <p className="lede">{copy.lede}</p>
          <p className="meta">{copy.meta}</p>
          <hr className="rule" />

          {kind === "concierge" && (
            <>
              <div className="compare">
                <div className="card">
                  <p className="tier">Amber</p>
                  <p className="price">
                    $39<small>/mo</small>
                  </p>
                  <p className="body">
                    Hire her yourself. She lands in your Telegram, you connect your
                    calendar and inbox, and she's working the same day. One price for
                    the household — up to five employees, however many you hire.
                  </p>
                  <p className="who">You set her up.</p>
                </div>
                <div className="card hero">
                  <p className="tier">Concierge</p>
                  <p className="price">By application</p>
                  <p className="body">
                    We set her up. We wire her into your school's portal, your Seesaw,
                    your class WeChat groups — the school-specific plumbing no global AI
                    tool will touch.
                  </p>
                  <p className="who">We do the setup, for you.</p>
                </div>
              </div>

              <p className="verdict">
                Same Amber underneath. <strong>Concierge is Amber plus us</strong> — doing
                the wiring, the onboarding and the messy bits by hand. Five families at a
                time, because that's how many we can do properly.
              </p>
            </>
          )}

          {kind !== "role" ? (
            <>
              <fieldset>
                <legend>What's eating your week?</legend>
                <p className="hint">Tick everything that applies</p>
                {PAIN.map((v) => (
                  <Opt
                    key={v}
                    type="checkbox"
                    checked={pain.includes(v)}
                    onChange={() => toggle(pain, setPain, v)}
                    label={v}
                  />
                ))}
                <Opt
                  type="checkbox"
                  checked={painOtherOn}
                  onChange={() => setPainOtherOn(!painOtherOn)}
                  label="Something else"
                />
                {painOtherOn && (
                  <input
                    className="inline-other"
                    type="text"
                    placeholder="What is it?"
                    value={painOther}
                    onChange={(e) => setPainOther(e.target.value)}
                  />
                )}
              </fieldset>

              <fieldset>
                <legend>Which portals and apps are you juggling?</legend>
                <p className="hint">Tick everything that applies</p>
                {PORTALS.map((v) => (
                  <Opt
                    key={v}
                    type="checkbox"
                    checked={portals.includes(v)}
                    onChange={() => toggle(portals, setPortals, v)}
                    label={v}
                  />
                ))}
                <Opt
                  type="checkbox"
                  checked={portalOtherOn}
                  onChange={() => setPortalOtherOn(!portalOtherOn)}
                  label="Something else"
                />
                {portalOtherOn && (
                  <input
                    className="inline-other"
                    type="text"
                    placeholder="Which one?"
                    value={portalOther}
                    onChange={(e) => setPortalOther(e.target.value)}
                  />
                )}
              </fieldset>

              <fieldset>
                <legend>Kids' ages</legend>
                <p className="hint">Tick everything that applies</p>
                {AGES.map((v) => (
                  <Opt
                    key={v}
                    type="checkbox"
                    checked={ages.includes(v)}
                    onChange={() => toggle(ages, setAges, v)}
                    label={v}
                  />
                ))}
              </fieldset>

              <fieldset>
                <legend>How many hours a week does this cost you?</legend>
                <p className="hint">Best guess is fine</p>
                {HOURS.map((v) => (
                  <Opt
                    key={v}
                    type="radio"
                    checked={hours === v}
                    onChange={() => setHours(v)}
                    label={v}
                  />
                ))}
              </fieldset>

              <fieldset>
                <legend>If you could hand over one thing tomorrow&hellip;</legend>
                <p className="hint">One line. The thing you'd stop doing tonight.</p>
                <textarea
                  value={oneThing}
                  onChange={(e) => setOneThing(e.target.value)}
                  placeholder="e.g. reading every school email and telling me only what needs a reply"
                />
              </fieldset>
            </>
          ) : (
            <>
              <fieldset>
                <legend>Which role would you hire?</legend>
                <p className="hint">Tick everything that applies</p>
                {ROLES_WANTED.map((v) => (
                  <Opt
                    key={v}
                    type="checkbox"
                    checked={rolesWanted.includes(v)}
                    onChange={() => toggle(rolesWanted, setRolesWanted, v)}
                    label={v}
                  />
                ))}
                <Opt
                  type="checkbox"
                  checked={roleOtherOn}
                  onChange={() => setRoleOtherOn(!roleOtherOn)}
                  label="Something else"
                />
                {roleOtherOn && (
                  <input
                    className="inline-other"
                    type="text"
                    placeholder="Which role?"
                    value={roleOther}
                    onChange={(e) => setRoleOther(e.target.value)}
                  />
                )}
              </fieldset>

              <fieldset>
                <legend>What would they take off your plate?</legend>
                <p className="hint">One line is plenty.</p>
                <textarea
                  value={roleTakesOff}
                  onChange={(e) => setRoleTakesOff(e.target.value)}
                  placeholder="e.g. chasing unpaid invoices every Friday"
                />
              </fieldset>

              <fieldset>
                <legend>What would that be worth monthly?</legend>
                <p className="hint">Rough is fine — it tells us what to build first</p>
                {WORTH.map((v) => (
                  <Opt
                    key={v}
                    type="radio"
                    checked={worth === v}
                    onChange={() => setWorth(v)}
                    label={v}
                  />
                ))}
              </fieldset>
            </>
          )}

          <hr className="rule" />

          <fieldset>
            <legend>Where do we find you?</legend>
            <p className="hint">We reply within two working days</p>
            <div className="grid2">
              <label className="field">
                <span className="lbl">Name</span>
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="field">
                <span className="lbl">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <p className="hint" style={{ marginTop: 6 }}>
              Best way to reach you
            </p>
            {CHANNELS.map((v) => (
              <Opt
                key={v}
                type="radio"
                checked={channel === v}
                onChange={() => setChannel(v)}
                label={v}
              />
            ))}
            <input
              className="inline-other"
              style={{ marginLeft: 0, marginTop: 10, maxWidth: "100%" }}
              type="text"
              placeholder="Number or handle (optional)"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
          </fieldset>

          <button className="submit" type="submit" disabled={sending}>
            {sending ? "Sending…" : copy.submitLabel}
          </button>
          <p className="foot">{copy.foot}</p>

          {error && (
            <div className="err">
              That didn't go through. Nothing's lost &mdash;{" "}
              <a href={error}>send it as an email instead</a>, your answers are already
              filled in.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
