/**
 * Email Notification Utility
 * Placeholder for integrating service like Resend or SendGrid.
 */

export async function sendEmail({
  to,
  subject,
  body,
  templateId
}: {
  to: string
  subject: string
  body?: string
  templateId?: string
}) {
  console.log(`[EMAIL SENT] To: ${to}, Subject: ${subject}`)
  
  // Implementation for production:
  // const { data, error } = await resend.emails.send({
  //   from: 'Fairway Impact <notifications@fairwayimpact.com>',
  //   to,
  //   subject,
  //   react: TemplateComponent({ body }),
  // });
  
  return { success: true }
}

export async function notifyWinner(userEmail: string, prize: number) {
  return sendEmail({
    to: userEmail,
    subject: 'You are a winner!',
    body: `Congratulations! You won $${prize.toFixed(2)} in the latest Fairway Impact draw.`
  })
}

export async function notifyDrawResults(userEmail: string) {
  return sendEmail({
    to: userEmail,
    subject: 'Latest Draw Results are out',
    body: 'Check the dashboard to see the latest winning numbers and results.'
  })
}
