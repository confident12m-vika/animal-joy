// Supabase returns English error messages/codes. This maps the common ones
// to our own translation keys so the person sees the error in whichever
// language the site is currently set to.
export function authErrorKey(err) {
  if (!err) return null
  const code = err.code || ''
  const msg = (err.message || '').toLowerCase()

  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return 'account.errorInvalidCredentials'
  }
  if (code === 'user_already_exists' || msg.includes('already registered') || msg.includes('already exists')) {
    return 'account.errorUserExists'
  }
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
    return 'account.errorEmailNotConfirmed'
  }
  if (code === 'otp_expired' || (msg.includes('invalid') && msg.includes('otp')) || msg.includes('token has expired')) {
    return 'account.errorInvalidCode'
  }
  if (code === 'weak_password' || msg.includes('password')) {
    return 'account.errorPasswordTooShort'
  }
  return 'account.errorGeneric'
}
