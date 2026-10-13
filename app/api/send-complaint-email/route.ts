import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { businessName, ownerEmail, customerName, rating, feedbackText } = await request.json()

    // Gebruik altijd onboarding@resend.dev voor gratis testing, 
    // en stuur hem naar het e-mailadres van de ondernemer (of je eigen testmail).
    const targetEmail = ownerEmail || process.env.RESEND_TEST_EMAIL || 'jouw-email@domein.nl'

    const data = await resend.emails.send({
      from: 'Reputio Review Shielding <onboarding@resend.dev>',
      to: [targetEmail],
      subject: `🚨 Nieuwe klacht ontvangen van ${customerName} (${rating} sterren)`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #f4f4f5; padding: 32px; border-radius: 16px; border: 1px solid #27272a;">
          <h2 style="color: #f43f5e; margin-top: 0; font-size: 20px; font-weight: 600;">Nieuwe Privé Klacht Ontvangen</h2>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5;">Er is zojuist een kritische beoordeling (${rating} sterren) opgevangen via jullie Review Shielding systeem voor <strong>${businessName}</strong>.</p>
          
          <div style="background-color: #18181b; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #f43f5e; border: 1px solid #27272a;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff;"><strong>Klant:</strong> ${customerName}</p>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #ffffff;"><strong>Score:</strong> ${'★'.repeat(rating)} (${rating}/5 sterren)</p>
            <p style="margin: 0 0 4px 0; font-size: 13px; color: #a1a1aa;"><strong>Feedback van klant:</strong></p>
            <p style="margin: 0; font-style: italic; color: #e4e4e7; font-size: 14px; line-height: 1.4;">&ldquo;${feedbackText}&rdquo;</p>
          </div>

          <p style="font-size: 12px; color: #71717a; margin-bottom: 0;">Log direct in op je Reputio Dashboard om contact op te nemen met deze klant en reputatieschade te voorkomen.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Resend API Error:', error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}