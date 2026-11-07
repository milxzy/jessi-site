export const concepts = [
  { key: 'a', letter: 'A', name: 'The Letter', idea: 'Opening Frances’s correspondence: paper, typed letters, envelopes placed by hand.' },
  { key: 'b', letter: 'B', name: 'The Tapestry', idea: 'The artwork is the architecture: cinematic, dark, and led by the illustration.' },
  { key: 'c', letter: 'C', name: 'The Archive', idea: 'A house with history keeps an archive: numbered plates, captions, an index.' },
  { key: 'd', letter: 'D', name: 'The Parlor', idea: 'A private room by appointment: soft, warm, arched windows, made for the phone.' },
  // not a fifth design of the whole site: a single pre-launch page. it only collects emails (Mailchimp).
  { key: 'landing-page', letter: 'Landing page', name: 'Landing page', idea: 'The pre-launch waitlist: Jessica’s note beside a fixed photograph, one email field, and the letters to come.' },
] as const

export type ConceptKey = (typeof concepts)[number]['key']
