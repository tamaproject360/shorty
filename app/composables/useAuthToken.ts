const TOKEN_KEY = 'ShortySiteToken'
const USER_KEY = 'ShortyCurrentUser'

export interface AuthUser {
  id: string
  username: string
  role: 'admin' | 'editor' | 'viewer'
}

export function useAuthToken() {
  function getToken() {
    if (import.meta.client) {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  }

  function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  function removeToken() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  function getUser(): AuthUser | null {
    if (!import.meta.client)
      return null

    const user = localStorage.getItem(USER_KEY)
    if (!user)
      return null

    try {
      return JSON.parse(user) as AuthUser
    }
    catch {
      removeToken()
      return null
    }
  }

  function setUser(user: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  return { getToken, setToken, removeToken, getUser, setUser }
}
