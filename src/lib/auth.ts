export interface JWTPayload {
  userId: string
  email: string
  role: string
  exp: number
  iat: number
}

export class AuthService {
  private static get JWT_SECRET(): string {
    return import.meta.env.JWT_SECRET || 'fallback-secret-change-in-production'
  }

  // Hash password using Web Crypto API
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + 'salt-change-in-production')
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password)
    return passwordHash === hash
  }

  // Generate JWT token (using Web Crypto API for signature)
  static async generateToken(userId: string, email: string, role: string): Promise<string> {
    const header = { alg: 'HS256', typ: 'JWT' }
    const payload: JWTPayload = {
      userId,
      email,
      role,
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
      iat: Math.floor(Date.now() / 1000)
    }

    const encoder = new TextEncoder()
    const secret = this.JWT_SECRET

    const headerB64 = this.base64UrlEncode(JSON.stringify(header))
    const payloadB64 = this.base64UrlEncode(JSON.stringify(payload))
    const data = `${headerB64}.${payloadB64}`

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(data)
    )

    const signatureB64 = this.base64UrlEncode(
      String.fromCharCode(...new Uint8Array(signature))
    )

    return `${data}.${signatureB64}`
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const [headerB64, payloadB64, signatureB64] = parts
      const data = `${headerB64}.${payloadB64}`

      const encoder = new TextEncoder()
      const secret = this.JWT_SECRET

      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      )

      const signatureString = this.base64UrlDecode(signatureB64)
      const signatureBuffer = encoder.encode(signatureString)
      const isValid = await crypto.subtle.verify(
        'HMAC',
        key,
        signatureBuffer,
        encoder.encode(data)
      )

      if (!isValid) return null

      const payload: JWTPayload = JSON.parse(this.base64UrlDecode(payloadB64))

      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null
      }

      return payload
    } catch {
      return null
    }
  }

  // Set auth cookie
  static setAuthCookie(response: Response, token: string): void {
    const headers = new Headers(response.headers)
    headers.append('Set-Cookie',
      `auth_token=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=86400; Path=/`
    )
  }

  // Clear auth cookie
  static clearAuthCookie(response: Response): void {
    const headers = new Headers(response.headers)
    headers.append('Set-Cookie',
      `auth_token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/`
    )
  }

  // Extract token from request
  static extractToken(request: Request): string | null {
    const authHeader = request.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7)
    }

    const cookieHeader = request.headers.get('Cookie')
    if (cookieHeader) {
      const match = cookieHeader.match(/auth_token=([^;]+)/)
      if (match) return match[1]
    }

    return null
  }

  private static base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  private static base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/')
    while (str.length % 4) str += '='
    return atob(str)
  }
}
