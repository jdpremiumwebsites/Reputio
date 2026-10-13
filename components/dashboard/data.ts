export type RequestStatus = 'google' | 'private' | 'pending'

export type ReviewRequest = {
  id: string
  name: string
  email: string
  phone: string
  channel: 'E-mail' | 'WhatsApp' | 'SMS'
  sentAt: string
  rating: number | null
  status: RequestStatus
}

export const statusLabels: Record<RequestStatus, string> = {
  google: 'Omgezet naar Google',
  private: 'Privé Feedback',
  pending: 'In Afwachting',
}

// Volledig leeg voor echte nieuwe klanten
export const initialRequests: ReviewRequest[] = []