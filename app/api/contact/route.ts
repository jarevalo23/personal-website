import { validateContact } from "@/lib/contact";

/**
 * POST /api/contact — sends the contact form.
 *
 * Configure ONE of these in Vercel → Project → Settings → Environment Variables:
 *   • Resend:    RESEND_API_KEY, CONTACT_TO_EMAIL, optional CONTACT_FROM_EMAIL
 *   • Formspree: FORMSPREE_FORM_ID (the part after https://formspree.io/f/)
 * With neither set it answers 503 and the form shows a mailto fallback.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real people never fill the hidden "company" field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const fields = validateContact(body);
  if (Object.keys(fields).length > 0) {
    return Response.json({ error: "invalid_input", fields }, { status: 422 });
  }

  const name = String(body.name)
    .trim()
    .replace(/[\r\n]+/g, " ");
  const email = String(body.email).trim();
  const message = String(body.message).trim();

  try {
    if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "Press Room <onboarding@resend.dev>",
          to: [process.env.CONTACT_TO_EMAIL],
          reply_to: email,
          subject: `Press room: new message from ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
      return Response.json({ ok: true });
    }

    if (process.env.FORMSPREE_FORM_ID) {
      const res = await fetch(`https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, _replyto: email, _subject: `Press room: ${name}` }),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      return Response.json({ ok: true });
    }
  } catch (err) {
    console.error("[contact] delivery failed:", err);
    return Response.json({ error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ error: "not_configured" }, { status: 503 });
}
