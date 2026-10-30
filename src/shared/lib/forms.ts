import { useState, type FormEvent } from 'react'
import { commerce } from '../commerce'

type Status = 'idle' | 'sending' | 'done' | 'error'

export function useSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    const r = await commerce.subscribeEmail(email.trim()).catch(() => ({ ok: false, message: 'The signup didn’t go through. Try again in a moment.' }))
    setStatus(r.ok ? 'done' : 'error')
    setMessage(r.message)
    if (r.ok) setEmail('')
  }
  return { email, setEmail, status, message, submit }
}

export interface ContactFields {
  name: string
  email: string
  order: string
  message: string
}

// the contact form has no backend yet (see readme). it validates, then says so plainly.
export function useContactForm() {
  const [fields, setFields] = useState<ContactFields>({ name: '', email: '', order: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFields, string>>>({})
  const [status, setStatus] = useState<'idle' | 'done'>('idle')
  const set = (k: keyof ContactFields) => (v: string) => setFields((f) => ({ ...f, [k]: v }))
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!fields.name.trim()) next.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = 'Enter an email address like name@example.com.'
    if (fields.message.trim().length < 5) next.message = 'Write a few words so we know how to help.'
    setErrors(next)
    if (!Object.keys(next).length) return setStatus('done')
    // after the error state renders, take the visitor to the first field that needs them
    const form = e.currentTarget as HTMLFormElement
    requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
  }
  return { fields, set, errors, status, submit }
}
