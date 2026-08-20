# CCAD rebuild on Hostinger VPS

Target host: `srv772652.hstgr.cloud` (KVM 4, Ubuntu 24.04 + Docker). Staging domain: **gravitix.ai**. Cut **collincad.org** over later.

This VPS runs the public site, staff dashboard, documents, and RAG chatbot. It does **not** replace HelpSpot, the taxpayer portal, GIS, or the appraisal database.

## Hardware

| | |
|---|---|
| vCPU | 4 |
| RAM | 16 GB |
| Disk | 200 GB |
| Headroom | ~9 GB if Langflow and local LLMs stay off |

Steady-state RAM use is about **7 GB**. Worker RAM spikes during PDF parse.

## Keep off this box

- Property search, protests, and owner accounts: `onlineportal.collincad.org`
- HelpSpot: existing host; website calls its API
- GIS / bulk appraisal extracts: existing open-data paths
- Local Ollama-class models: will not fit beside this stack

## What runs on the VPS

| Service | Role | RAM | On this VPS |
|---|---|---|---|
| Caddy | HTTPS reverse proxy for gravitix.ai | 0.1 GB | Yes |
| Next.js | Public site + staff dashboard | 1 GB | Yes |
| Postgres + pgvector | CMS, users, files, embeddings | 2 GB | Yes |
| Redis | Sessions and ingest job queue | 0.3 GB | Yes |
| Parse worker | Chunk PDFs, call embedding API | 1.5 GB avg | Yes |
| n8n | Scheduled jobs only; admin UI, separate login | 0.8 GB | Yes, private |
| Langflow | Visual LLM playground | 2–4 GB | Skip for v1 |
| Ollama / local LLM | On-box inference | 8 GB+ | No |
| HelpSpot | Helpdesk of record | n/a | Keep existing host |
| Taxpayer portal / PACS | Property search and protests | n/a | Keep existing host |

## Request flow

Public users and staff hit **Caddy** → **Next.js**.

Next.js talks to **Postgres**, **Redis**, **LLM APIs**, and **HelpSpot**.

Redis feeds the **parse worker**. n8n is a private job runner, not the HelpSpot path.

## What Next.js owns

**Public site:** pages, news, forms library, document downloads (replacing WordPress). Chatbot answers only from published public chunks, with citations.

**Staff dashboard:** accounts stored in this app (not Microsoft). Roles for create/publish pages, upload documents, and send HelpSpot tickets through the same dashboard session.

## Dashboard session vs n8n

n8n is a different application with its own cookie. A logged-in dashboard user is **not** logged into n8n.

Staff never need the n8n UI. HelpSpot calls run in Next.js using the dashboard session, then a server-side API key.

| Who | Logs into | Session |
|---|---|---|
| Editors, publishers, public (chat escalate) | Next.js dashboard / site only | One app session. HelpSpot is an API call from the server. |
| One or two technical admins | n8n UI (`n8n.gravitix.ai`, not public) | Separate n8n username/password. Not the dashboard cookie. |
| Optional later: Caddy forward-auth | n8n UI gated by Next.js admin role | Possible, but extra glue. Do not build this for v1. |

## n8n vs Langflow

Keep n8n as a private job runner (reindex, mail). Do not run Langflow in production on this VPS unless you later need a playground and can spare 3 GB.

| Need | Better tool | Why |
|---|---|---|
| HelpSpot ticket create/update | Next.js API | Uses the dashboard session, then the HelpSpot API key on the server. |
| Upload → parse → embed → index | Next.js worker | Versioned in git, retryable queue. |
| Chat over district documents | App RAG (pgvector + LLM API) | Citations, publish flags, and rate limits belong in the product. |
| Visual prompt experiments | Langflow later, or not at all | Overlaps the worker. Fine as a stopped Compose profile, not always-on. |

## Document and chatbot path

| Step | Where it runs | Rule |
|---|---|---|
| Staff uploads PDF/DOCX | Dashboard → disk volume | Metadata in Postgres, file not in the database |
| Parse, chunk, embed | Worker via Redis queue | Only published public docs enter the vector index |
| Public download | Next.js file route | Same publish flag as the chatbot |
| Ask the chatbot | Next.js → pgvector → LLM API | Answer with citations; refuse off-corpus guesses |
| Cannot answer / wants a human | Next.js → HelpSpot API | Same dashboard/site session; ticket lives in HelpSpot |

LLM providers: hosted models (OpenAI, Anthropic, or Azure OpenAI). Do not send HelpSpot ticket bodies or owner PINs into the public chatbot context.

Postgres is used instead of MySQL so pgvector keeps CMS data and embeddings in one backup.

## Suggested roles

| Role | Public site | Documents | Chatbot corpus | Users |
|---|---|---|---|---|
| Public | Read | Download published | Ask | None |
| Editor | Draft pages | Upload | Index drafts privately | None |
| Publisher | Publish | Publish / unpublish | Promote to public index | None |
| Admin | All | All | All | Manage staff accounts |

## Edge and origin defenses

Cloudflare is the front door. The VPS does not try to be a second WAF. Caddy and Next.js handle what Cloudflare cannot see: login abuse, chatbot cost, uploads, and fake WordPress probes.

**Cloudflare must actually sit in front.** Today `gravitix.ai` A records at Network Solutions point at `69.62.71.180`. That traffic never hits Cloudflare. Orange-cloud the hostname (Cloudflare nameservers, or a Cloudflare CNAME/A setup) so visitors reach CF first, then the VPS.

### Cloudflare (do most of it here)

| Tactic | Where | Notes |
|---|---|---|
| DDoS / bot fight / managed WAF | Cloudflare | Default on for a public CAD site |
| Rate limit `/login`, `/api/chat`, `/api/upload` | Cloudflare custom rules | Chatbot is the expensive path |
| Turnstile | Contact / ticket / chat forms | Better than a visible CAPTCHA wall on every page |
| IP / ASN / country rules | Cloudflare | Use sparingly; this is a public Texas district site |
| Under Attack mode | Cloudflare | Emergency only |
| Hide origin IP | Cloudflare + Hostinger firewall | Only Cloudflare IP ranges may hit 80/443 on the VPS |
| Ban list | Cloudflare IP Access Rules or WAF | Prefer this over a hosts file on the box |

### Origin (Caddy + Hostinger firewall)

| Tactic | Purpose |
|---|---|
| Allowlist Cloudflare IPs on 80/443 | Stops people who discover the VPS IP and skip Cloudflare |
| Authenticated Origin Pulls | TLS client certs so only Cloudflare can talk to Caddy |
| Body size and timeouts | Stops huge uploads and slowloris-style requests |
| Do not expose Postgres, Redis, n8n, SSH 22 | n8n on a subdomain still behind Cloudflare + its own login |
| CrowdSec (optional later) | Community blocklists at the origin; not required for v1 |

Caddy’s stock image has weak rate limiting. Do not add a custom Caddy build just for that. Put HTTP rate limits in Cloudflare and in Next.js.

### Application (Next.js)

| Tactic | Purpose |
|---|---|
| Login lockout / backoff | Brute force on in-app accounts (Cloudflare will not know a password is wrong) |
| Chatbot quotas | Per IP and per session; cap tokens so an LLM bill cannot run away |
| Upload rules | Type, size, publish flag; malware scan later |
| Honeypot field | Hidden input on public forms; fail closed, log, optional Cloudflare ban via API |
| Fake WordPress paths | `wp-login.php`, `xmlrpc.php`, `wp-admin` → 404, log, do not run WordPress |
| Security headers | HSTS, CSP, frame deny on `/dashboard` |
| CSRF on dashboard actions | Session cookie is already the staff gate |

Honeypots stay simple: a hidden form field and a couple of decoy URLs. Do not install a fake WordPress or an open “attacker playground.” That adds attack surface.

Blacklists of individual IPs on the VPS are almost useless with Cloudflare in front: Caddy would see Cloudflare’s addresses unless you read `CF-Connecting-IP` (and even then, maintain the list in Cloudflare). Ban at the edge; lock accounts in the app.

## Build order

1. **Phase 0** — Caddy + Postgres + Redis + Next.js skeleton with in-app logins and roles on gravitix.ai
2. **Phase 1** — CMS pages and navigation that replace the WordPress brochure site
3. **Phase 2** — Document library: upload, public download, publish flag
4. **Phase 3** — Parse worker, embeddings, pgvector, cited chatbot
5. **Phase 4** — HelpSpot API from Next.js; private n8n for scheduled jobs; first weekly backup after go-live

## Decisions already made

- Staging host: gravitix.ai
- Staff accounts live in this Next.js app, not Microsoft
- HelpSpot stays on its current host; the website calls its API
- n8n is admin-only with a separate login
- Property search links out; it does not move onto this VPS
- Cloudflare is the WAF/rate-limit/bot layer; the VPS only allowlists Cloudflare and hardens the app
