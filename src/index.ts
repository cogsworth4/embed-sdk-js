import axios, { AxiosRequestHeaders } from 'axios'
import renderSignupScreen from './screens/signup'
import renderAuthorizeScreen from './screens/authorize'
import renderEmbedApp from './screens/embed-app'
import renderAskAdminScreen from './screens/ask-admin'
import renderNewBusinessScreen from './screens/new-business'

const EMBED_APP_URL =
  process.env.NEXT_PUBLIC_EMBED_APP_URL || 'https://embed-app.vercel.app'

export interface PayloadEndpoint {
  url: string
  headers: AxiosRequestHeaders
}

export default class CogsworthClient {
  private payload: any
  private payloadEndpoint: PayloadEndpoint

  constructor({ payloadEndpoint }: { payloadEndpoint: PayloadEndpoint }) {
    this.payloadEndpoint = payloadEndpoint
  }

  async init(elementId: string) {
    this.payload = await this.getPayload()

    const element = document.getElementById(elementId)
    if (!element) {
      console.error(
        `Cogsworth Embed App: Element with ID ${elementId} not found`
      )
      return
    }

    const { user, business } = await this.getUserStatus()
    if (user === 'UNAUTHORIZED' || business === 'UNAUTHORIZED') {
      return renderAuthorizeScreen(element)
    }

    const role = this.payload.business.userRole

    // When business exists already, we can always prompt the user to sign up
    if (user === 'NOT_FOUND' && business === 'CREATED') {
      return renderSignupScreen(element, () => this.embedApp(element))
    }

    // Only owners can be prompted sign up to create a new business;
    // other roles are prompted to ask an admin to sign up first
    if (user === 'NOT_FOUND' && business === 'NOT_FOUND') {
      return role === 'OWNER'
        ? renderSignupScreen(element, () => this.embedApp(element))
        : renderAskAdminScreen(element)
    }
    // If user exists already, we render the new business screen instead
    if (user === 'CREATED' && business === 'NOT_FOUND') {
      return role === 'OWNER'
        ? renderNewBusinessScreen(element, () => this.embedApp(element))
        : renderAskAdminScreen(element)
    }

    // Only possible scenario left is that both the business and user already exist
    // We can safely render the embed app now
    return this.embedApp(element)
  }

  private async embedApp(element: HTMLElement) {
    const embedUrl = await this.getEmbedUrl()
    renderEmbedApp(element, embedUrl)
  }

  private async getUserStatus() {
    const response = await axios.get(
      `${EMBED_APP_URL}/api/partner/${encodeURIComponent(
        this.payload.partnerId
      )}/user-status?userEmail=${encodeURIComponent(
        this.payload.user.email
      )}&businessId=${encodeURIComponent(this.payload.business.id)}`
    )

    return response.data.data as { user: string; business: string }
  }

  private async getEmbedUrl(): Promise<string> {
    /*
     * Upserting user and business every time the embed-url
     * is requested ensures that they exist and are always
     * up to date with the partner's data.
     */
    const user = await this.upsertUser()
    const business = await this.upsertBusiness(user.data.id)

    return business.data.embedUrl
  }

  private async getPayload() {
    const response = await axios.get(this.payloadEndpoint.url, {
      headers: {
        'Content-Type': 'application/json',
        ...(this.payloadEndpoint.headers || {}),
      },
    })

    return response.data
  }

  private async upsertBusiness(cogsworthUserId: string) {
    // Call embed-api upsert-business endpoint
    const response = await axios.put(
      `${EMBED_APP_URL}/api/partner/${this.payload.partnerId}/users/${cogsworthUserId}/businesses`,
      {
        id: this.payload.business.id, // This is the partner's internal id for this resource
        name: this.payload.business.name,
        timestamp: this.payload.timestamp,
        timezone: this.payload.business.timezone,
        userRole: this.payload.business.userRole,
        location: this.payload.business.location,
      },
      {
        headers: {
          Authorization: `Bearer: ${this.payload.business.signature}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data
  }

  private async upsertUser() {
    // Call embed-api upsert-user endpoint
    const response = await axios.put(
      `${EMBED_APP_URL}/api/partner/${this.payload.partnerId}/users`,
      {
        id: this.payload.user.id, // This is the partner's internal id for this resource
        name: this.payload.user.name,
        email: this.payload.user.email,
        timestamp: this.payload.timestamp,
      },
      {
        headers: {
          Authorization: `Bearer: ${this.payload.user.signature}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data
  }
}
