export function usernameValidator(username) {
    if (!username) return "Username can't be empty."
    if (username.length < 4) return 'Username length must exceed 4 characters'
    return ''
  }