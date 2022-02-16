import axios, { AxiosRequestHeaders } from 'axios'
import { appendStyles, removeElement, renderIntoContainer } from './utils'
import TEMPLATES, { CLASSES, STYLES } from './templates'

const EMBED_APP_URL =
  process.env.NEXT_PUBLIC_EMBED_APP_URL || 'https://embed-app.vercel.app'

export interface PayloadEndpoint {
  url: string
  headers: AxiosRequestHeaders
}

export default class CogsworthClient {
  private payload: any
  private payloadEndpoint: PayloadEndpoint
  private container: HTMLElement

  constructor({
    payloadEndpoint,
    containerSelector,
  }: {
    payloadEndpoint: PayloadEndpoint
    containerSelector: string
  }) {
    this.payloadEndpoint = payloadEndpoint

    const container = document.querySelector(containerSelector)
    if (!container) {
      console.error(
        `Could not load Cogsworth widget: Element with selector ${containerSelector} not found`
      )
      return
    }

    this.container = container as HTMLElement
  }

  async init() {
    if (!this.container) {
      return
    }

    this.payload = await this.getPayload()

    appendStyles(STYLES)
    renderIntoContainer(this.container, TEMPLATES.LOADING)

    const { user, business } = await this.getUserStatus()
    if (user === 'UNAUTHORIZED' || business === 'UNAUTHORIZED') {
      renderIntoContainer(this.container, TEMPLATES.AUTHORIZE)
    }

    const role = this.payload.business.userRole

    // When business exists already, we can always prompt the user to sign up
    if (user === 'NOT_FOUND' && business === 'CREATED') {
      return renderIntoContainer(this.container, TEMPLATES.SIGNUP, {
        onClick: () => this.embedApp(),
      })
    }

    // Only owners can be prompted sign up to create a new business;
    // other roles are prompted to ask an admin to sign up first
    if (user === 'NOT_FOUND' && business === 'NOT_FOUND') {
      if (role === 'OWNER') {
        return renderIntoContainer(this.container, TEMPLATES.SIGNUP, {
          onClick: () => this.embedApp(),
        })
      } else {
        return renderIntoContainer(this.container, TEMPLATES.ASK_ADMIN)
      }
    }
    // If user exists already, we render the new business screen instead
    if (user === 'CREATED' && business === 'NOT_FOUND') {
      if (role === 'OWNER') {
        return renderIntoContainer(this.container, TEMPLATES.NEW_BUSINESS, {
          onClick: () => this.embedApp(),
        })
      } else {
        return renderIntoContainer(this.container, TEMPLATES.ASK_ADMIN)
      }
    }

    // Only possible scenario left is that both the business and user already exist
    // We can safely render the embed app now
    return this.embedApp()
  }

  private async embedApp() {
    renderIntoContainer(this.container, TEMPLATES.LOADING)

    // Create the iframe element and hide it
    const embedUrl = await this.getEmbedUrl()
    const iframe = document.createElement('iframe')
    iframe.setAttribute('class', CLASSES.IFRAME)
    iframe.setAttribute('style', 'display: none;')
    iframe.setAttribute('src', embedUrl)
    this.container.append(iframe)

    // Once the app has loaded, we can display the iframe
    iframe.onload = (e) => {
      removeElement(`.${CLASSES.LOADING}`)
      iframe.removeAttribute('style')
    }
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
