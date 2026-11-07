import { useState, type FormEvent } from 'react'

// Mailchimp waitlist signup for the landing page (design E). it does one job: add an email to one audience.
//
// setup: in Mailchimp, Audience > Signup forms > Embedded forms. copy the form's `action` URL,
// which looks like https://yourname.us21.list-manage.com/subscribe/post?u=ABC123&id=DEF456&f_id=0012ab
// and set it as VITE_MAILCHIMP_FORM_ACTION. nothing else is needed, and no API key is ever used:
// the action URL is the public endpoint Mailchimp builds for exactly this purpose.
//
// mailchimp's endpoint doesn't send CORS headers, so the browser can't read a normal fetch reply.
// its own "post-json" variant answers as JSONP instead, which lets us show the real result (success,
// already subscribed, invalid address) rather than guessing.

const ACTION = (import.meta.env.VITE_MAILCHIMP_FORM_ACTION ?? '').trim()

export const isMailchimpConfigured = /^https:\/\/[^/]+\/subscribe\/post\?/.test(ACTION)

export type SignupStatus = 'idle' | 'sending' | 'done' | 'error'
interface Result {
  ok: boolean
  message: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const THANKS = 'Thank you. Look for a note from Jessi Frances in your inbox. If it asks you to confirm your address, please do, and the letters will begin.'
const FAILED = 'That didn’t go through. Check your connection and try again in a moment.'

// mailchimp replies with html and its own wording. keep the meaning, drop the markup, say it our way.
function plain(html: string) {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/^\s*\d+\s*-\s*/, '').replace(/\s+/g, ' ').trim()
  if (/already subscribed/i.test(text)) return 'You’re already on the list. The letters will find you.'
  if (/too many|recent signup/i.test(text)) return 'There have been a few attempts from this address. Please wait a few minutes and try again.'
  if (/valid email|invalid|looks fake|syntax/i.test(text)) return 'Enter an email address like name@example.com.'
  return FAILED
}

function jsonp(url: string, timeoutMs = 12000): Promise<{ result: string; msg: string }> {
  return new Promise((resolve, reject) => {
    const cb = `__jfMailchimp${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    const w = window as unknown as Record<string, unknown>
    const script = document.createElement('script')
    const done = () => {
      clearTimeout(timer)
      delete w[cb]
      script.remove()
    }
    const timer = setTimeout(() => {
      done()
      reject(new Error('timeout'))
    }, timeoutMs)
    w[cb] = (data: { result: string; msg: string }) => {
      done()
      resolve(data)
    }
    script.onerror = () => {
      done()
      reject(new Error('network'))
    }
    script.src = `${url}&c=${cb}`
    document.head.appendChild(script)
  })
}

export async function joinWaitlist(email: string): Promise<Result> {
  if (!EMAIL.test(email)) return { ok: false, message: 'Enter an email address like name@example.com.' }

  if (!isMailchimpConfigured) {
    // design presentation: no audience connected yet, so show the visitor's side of the journey only.
    console.info('[jessi frances] VITE_MAILCHIMP_FORM_ACTION is not set. This signup was not sent to Mailchimp.')
    await new Promise((r) => setTimeout(r, 700))
    return { ok: true, message: THANKS }
  }

  try {
    const u = new URL(ACTION)
    const userId = u.searchParams.get('u')
    const listId = u.searchParams.get('id')
    const params = new URLSearchParams({ EMAIL: email })
    if (userId) params.set('u', userId)
    if (listId) params.set('id', listId)
    // mailchimp's own bot trap: a field that must stay empty
    if (userId && listId) params.set(`b_${userId}_${listId}`, '')
    const endpoint = `${u.origin}${u.pathname.replace(/\/post$/, '/post-json')}?${params.toString()}`
    const r = await jsonp(endpoint)
    return r.result === 'success' ? { ok: true, message: THANKS } : { ok: false, message: plain(r.msg ?? '') }
  } catch {
    return { ok: false, message: FAILED }
  }
}

export function useWaitlist() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<SignupStatus>('idle')
  const [message, setMessage] = useState('')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setMessage('')
    const r = await joinWaitlist(email.trim())
    setStatus(r.ok ? 'done' : 'error')
    setMessage(r.message)
    if (r.ok) setEmail('')
  }
  return { email, setEmail, status, message, submit }
}
