// generates the placeholder 2027 house tapestry as layered svg files.
// this is a stand-in for madi's commissioned artwork, not the artwork itself.
// run: npm run tapestry
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(process.cwd(), 'public/placeholders/tapestry')
mkdirSync(OUT, { recursive: true })

const C = {
  ground: '#2a1d15',
  weave: '#3a2a1f',
  line: '#e6d8bf',
  gold: '#c2a067',
  petal: '#f2e9da',
  petalShade: '#d8c6a8',
  vein: '#b39a76',
  opal: '#cfe0dc',
}

// seeded so every layer agrees on where the branches end
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f = (n) => Math.round(n * 10) / 10

function leaf(x, y, ang, len, wid, fill, stroke) {
  const deg = (ang * 180) / Math.PI
  return `<path transform="translate(${f(x)} ${f(y)}) rotate(${f(deg)})" d="M0 0 Q${f(len / 2)} ${f(-wid)} ${f(len)} 0 Q${f(len / 2)} ${f(wid)} 0 0Z" fill="${fill}" stroke="${stroke}" stroke-width="0.6"/>`
}

function compose({ w, h, seed, R, cy, emblemY, sunMoonY, wide }) {
  const rand = rng(seed)
  const s = Math.min(w, h) / 1000
  const cx = w / 2
  const branches = []
  const tips = []

  function grow(x, y, ang, len, depth, max) {
    const bend = (rand() - 0.5) * 0.6
    const x2 = x + Math.cos(ang) * len
    const y2 = y + Math.sin(ang) * len
    const qx = x + Math.cos(ang + bend) * len * 0.55
    const qy = y + Math.sin(ang + bend) * len * 0.55
    branches.push({ d: `M${f(x)} ${f(y)}Q${f(qx)} ${f(qy)} ${f(x2)} ${f(y2)}`, w: 7 * s * Math.pow(0.62, depth) + 0.5 })
    if (depth >= max) {
      tips.push({ x: x2, y: y2, ang })
      return
    }
    const n = depth < 1 ? 2 : rand() < 0.28 ? 3 : 2
    for (let i = 0; i < n; i++) {
      const spread = 0.34 + rand() * 0.3
      const a = ang + (i - (n - 1) / 2) * spread + (rand() - 0.5) * 0.12
      grow(x2, y2, a, len * (0.7 + rand() * 0.12), depth + 1, max)
    }
  }

  const baseY = cy + R * 0.82
  const forkY = cy + R * 0.18
  branches.push({ d: `M${f(cx)} ${f(baseY)}C${f(cx - 6 * s)} ${f(baseY - 60 * s)} ${f(cx + 5 * s)} ${f(forkY + 50 * s)} ${f(cx)} ${f(forkY)}`, w: 9 * s })
  grow(cx, forkY, -Math.PI / 2 - 0.4, R * 0.34, 1, 5)
  grow(cx, forkY, -Math.PI / 2 + 0.4, R * 0.34, 1, 5)
  grow(cx, forkY + 10 * s, -Math.PI / 2, R * 0.3, 2, 5)

  // roots: shallow, wide, and kept above the emblem
  const roots = []
  function root(x, y, ang, len, depth) {
    const x2 = x + Math.cos(ang) * len
    const y2 = y + Math.sin(ang) * len * 0.55
    const qx = x + Math.cos(ang) * len * 0.5 + (rand() - 0.5) * 12 * s
    const qy = y + Math.sin(ang) * len * 0.35
    roots.push({ d: `M${f(x)} ${f(y)}Q${f(qx)} ${f(qy)} ${f(x2)} ${f(y2)}`, w: 5 * s * Math.pow(0.6, depth) + 0.4 })
    if (depth >= 4) return
    const n = rand() < 0.5 ? 2 : 1
    for (let i = 0; i < n; i++) root(x2, y2, ang + (rand() - 0.5) * 0.9, len * 0.66, depth + 1)
  }
  for (const a of [0.25, 0.75, 1.2, 1.94, 2.39, 2.89]) root(cx, baseY, a, R * 0.32, 0)

  // vines climb the two sides and curl
  const vines = []
  const vineLeaves = []
  const vineBuds = []
  const sideX = wide ? [w * 0.16, w * 0.84] : [w * 0.1, w * 0.9]
  sideX.forEach((x0, side) => {
    const dir = side === 0 ? 1 : -1
    let d = ''
    const top = h * 0.2
    const bottom = h - 70 * s
    const steps = 60
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const y = bottom - (bottom - top) * t
      const x = x0 + Math.sin(t * Math.PI * 3.2 + side) * 26 * s * dir
      d += (i === 0 ? 'M' : 'L') + f(x) + ' ' + f(y)
      if (i % 6 === 3) {
        const la = (dir > 0 ? -0.6 : Math.PI + 0.6) + (rand() - 0.5) * 0.4
        vineLeaves.push(leaf(x, y, la, 30 * s, 8 * s, C.ground, C.line))
        vineLeaves.push(leaf(x, y, la + (dir > 0 ? 1.7 : -1.7), 24 * s, 7 * s, C.ground, C.line))
      }
      if (i % 15 === 7) {
        // small curl, the vine's tendril
        const r = 12 * s
        vines.push(`<path d="M${f(x)} ${f(y)}c${f(dir * r)} ${f(-r)} ${f(dir * r * 2.2)} ${f(r * 0.2)} ${f(dir * r * 1.4)} ${f(r)}c${f(-dir * r * 0.5)} ${f(r * 0.5)} ${f(-dir * r)} 0 ${f(-dir * r * 0.6)} ${f(-r * 0.5)}" fill="none" stroke="${C.line}" stroke-width="0.8" opacity="0.8"/>`)
      }
      if (i === steps) vineBuds.push({ x, y, ang: -Math.PI / 2 + dir * 0.2 })
    }
    vines.push(`<path d="${d}" fill="none" stroke="${C.line}" stroke-width="${f(1.4 * s + 0.4)}" opacity="0.85"/>`)
  })

  // the branch that reaches out through the open c to the bloom
  const gap = -0.42
  const bloomX = cx + Math.cos(gap) * R * 1.02
  const bloomY = cy + Math.sin(gap) * R * 1.02
  const from = tips.reduce((best, t) => (Math.hypot(t.x - bloomX, t.y - bloomY) < Math.hypot(best.x - bloomX, best.y - bloomY) ? t : best), tips[0])
  branches.push({ d: `M${f(from.x)} ${f(from.y)}Q${f((from.x + bloomX) / 2 + 10 * s)} ${f(Math.min(from.y, bloomY) - 24 * s)} ${f(bloomX)} ${f(bloomY + 10 * s)}`, w: 1.4 * s + 0.4 })

  // tree leaves at most tips, buds at a few
  const treeLeaves = []
  const budTips = []
  const byX = tips.filter((t) => t !== from).sort((p, q) => p.x - q.x)
  const pick = new Set([0.08, 0.3, 0.52, 0.7].map((q) => byX[Math.floor(q * (byX.length - 1))]))
  byX.forEach((t) => {
    if (pick.has(t)) budTips.push(t)
    else if (rand() < 0.75) treeLeaves.push(leaf(t.x, t.y, t.ang + (rand() - 0.5) * 0.8, 20 * s, 6 * s, C.ground, C.line))
  })

  const stroke = (arr, color, op) => arr.map((b) => `<path d="${b.d}" fill="none" stroke="${color}" stroke-width="${f(b.w)}" stroke-linecap="round" opacity="${op}"/>`).join('')

  // ---- layers
  const weaveId = `w${seed}`
  const ground = `
<defs><pattern id="${weaveId}" width="${f(7 * s + 2)}" height="${f(7 * s + 2)}" patternUnits="userSpaceOnUse">
<path d="M0 ${f((7 * s + 2) / 2)}H${f(7 * s + 2)}" stroke="${C.weave}" stroke-width="0.7"/>
<path d="M${f((7 * s + 2) / 2)} 0V${f(7 * s + 2)}" stroke="${C.weave}" stroke-width="0.35"/></pattern></defs>
<rect width="${w}" height="${h}" fill="${C.ground}"/>
<rect width="${w}" height="${h}" fill="url(#${weaveId})" opacity="0.55"/>
<rect x="${f(26 * s)}" y="${f(26 * s)}" width="${f(w - 52 * s)}" height="${f(h - 52 * s)}" fill="none" stroke="${C.gold}" stroke-width="1" opacity="0.55"/>
<rect x="${f(34 * s)}" y="${f(34 * s)}" width="${f(w - 68 * s)}" height="${f(h - 68 * s)}" fill="none" stroke="${C.gold}" stroke-width="0.5" opacity="0.4"/>`

  const vinesLayer = stroke(roots, C.line, 0.7) + stroke(branches, C.line, 0.92) + vines.join('') + vineLeaves.join('') + treeLeaves.join('')

  function bud(x, y, ang, len) {
    const deg = (ang * 180) / Math.PI + 90
    const L = len
    const W = len * 0.36
    return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(deg)})">
<path d="M0 0C${f(-W)} ${f(-L * 0.3)} ${f(-W * 0.5)} ${f(-L * 0.85)} 0 ${f(-L)}C${f(W * 0.5)} ${f(-L * 0.85)} ${f(W)} ${f(-L * 0.3)} 0 0Z" fill="${C.petal}" stroke="${C.vein}" stroke-width="0.6"/>
<path d="M0 ${f(-L * 0.08)}Q${f(W * 0.25)} ${f(-L * 0.5)} 0 ${f(-L * 0.92)}" fill="none" stroke="${C.vein}" stroke-width="0.5"/>
<path d="M0 0C${f(-W * 0.9)} ${f(-L * 0.12)} ${f(-W * 0.8)} ${f(-L * 0.32)} ${f(-W * 0.45)} ${f(-L * 0.38)}M0 0C${f(W * 0.9)} ${f(-L * 0.12)} ${f(W * 0.8)} ${f(-L * 0.32)} ${f(W * 0.45)} ${f(-L * 0.38)}" fill="none" stroke="${C.gold}" stroke-width="0.9"/></g>`
  }

  function bloom(x, y, size) {
    const petal = (ang, len, wid, fill) => {
      const deg = (ang * 180) / Math.PI + 90
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(deg)})"><path d="M0 0C${f(-wid)} ${f(-len * 0.25)} ${f(-wid * 0.9)} ${f(-len * 0.8)} 0 ${f(-len)}C${f(wid * 0.9)} ${f(-len * 0.8)} ${f(wid)} ${f(-len * 0.25)} 0 0Z" fill="${fill}" stroke="${C.vein}" stroke-width="0.7"/><path d="M0 ${f(-len * 0.1)}Q${f(wid * 0.18)} ${f(-len * 0.5)} 0 ${f(-len * 0.9)}" fill="none" stroke="${C.vein}" stroke-width="0.5" opacity="0.8"/></g>`
    }
    const up = -Math.PI / 2
    // magnolia: a tall cup of tepals, the outer pair just beginning to open
    const back = [up - 0.62, up + 0.62, up - 0.2, up + 0.2].map((a, i) => petal(a, size * (i < 2 ? 0.86 : 1.08), size * 0.24, C.petalShade))
    const front = [up - 0.42, up + 0.42, up - 0.08, up + 0.1].map((a, i) => petal(a, size * (i < 2 ? 0.94 : 1.02), size * 0.26, C.petal))
    const stem = `<path d="M${f(x)} ${f(y)}q${f(-3 * s)} ${f(14 * s)} ${f(2 * s)} ${f(26 * s)}" fill="none" stroke="${C.line}" stroke-width="1.2"/>`
    const sepals = leaf(x, y + 2 * s, Math.PI * 0.82, 22 * s, 6 * s, C.ground, C.gold) + leaf(x, y + 2 * s, Math.PI * 0.18, 22 * s, 6 * s, C.ground, C.gold)
    // the opal glint at the heart of the bloom: seen once, small
    const heart = `<ellipse cx="${f(x)}" cy="${f(y - size * 0.34)}" rx="${f(size * 0.045)}" ry="${f(size * 0.09)}" fill="${C.opal}" opacity="0.9"/>`
    return stem + sepals + back.join('') + front.join('') + heart
  }

  const bloomLayer =
    bloom(bloomX, bloomY, 96 * s) +
    budTips.map((t) => bud(t.x, t.y, t.ang, 30 * s)).join('') +
    vineBuds.map((t) => bud(t.x, t.y, t.ang, 26 * s)).join('')

  // symbols: open c, moon, sun, keyhole in laurel, mmxxvii
  const a0 = gap + 0.34
  const a1 = gap - 0.34 + Math.PI * 2
  const arc = (r, sw, op) => {
    const x0 = cx + Math.cos(a0) * r
    const y0 = cy + Math.sin(a0) * r
    const x1 = cx + Math.cos(a1) * r
    const y1 = cy + Math.sin(a1) * r
    return `<path d="M${f(x0)} ${f(y0)}A${f(r)} ${f(r)} 0 1 1 ${f(x1)} ${f(y1)}" fill="none" stroke="${C.gold}" stroke-width="${f(sw)}" stroke-linecap="round" opacity="${op}"/>`
  }
  const moonX = wide ? w * 0.2 : w * 0.2
  const sunX = wide ? w * 0.8 : w * 0.8
  const mr = 30 * s
  // crescent as a gold disc with a ground-coloured disc laid over it
  const moon = `<circle cx="${f(moonX)}" cy="${f(sunMoonY)}" r="${f(mr)}" fill="${C.gold}" opacity="0.9"/><circle cx="${f(moonX + mr * 0.42)}" cy="${f(sunMoonY - mr * 0.18)}" r="${f(mr * 0.86)}" fill="${C.ground}"/>`
  let rays = ''
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2
    const r1 = 30 * s
    const r2 = r1 + (i % 2 ? 9 : 17) * s
    rays += `<path d="M${f(sunX + Math.cos(a) * r1)} ${f(sunMoonY + Math.sin(a) * r1)}L${f(sunX + Math.cos(a) * r2)} ${f(sunMoonY + Math.sin(a) * r2)}" stroke="${C.gold}" stroke-width="0.8"/>`
  }
  const sun = `<circle cx="${f(sunX)}" cy="${f(sunMoonY)}" r="${f(22 * s)}" fill="none" stroke="${C.gold}" stroke-width="1.4"/><circle cx="${f(sunX)}" cy="${f(sunMoonY)}" r="${f(4 * s)}" fill="${C.gold}"/>${rays}`

  const ky = emblemY
  const kr = 9 * s
  const keyhole = `<path d="M${f(cx)} ${f(ky - kr * 2.2)}a${f(kr)} ${f(kr)} 0 0 1 ${f(kr * 0.55)} ${f(kr * 1.83)}l${f(kr * 0.45)} ${f(kr * 2.4)}h${f(-kr * 2)}l${f(kr * 0.45)} ${f(-kr * 2.4)}a${f(kr)} ${f(kr)} 0 0 1 ${f(kr * 0.55)} ${f(-kr * 1.83)}Z" fill="${C.gold}"/>`
  let laurel = ''
  for (const dir of [-1, 1]) {
    const r = 46 * s
    laurel += `<path d="M${f(cx + dir * 8 * s)} ${f(ky + 34 * s)}A${f(r)} ${f(r)} 0 0 ${dir > 0 ? 0 : 1} ${f(cx + dir * 40 * s)} ${f(ky - 34 * s)}" fill="none" stroke="${C.gold}" stroke-width="0.9"/>`
    for (let i = 0; i < 7; i++) {
      const t = i / 6
      const ang = Math.PI / 2 + dir * (0.25 + t * 1.6)
      const px = cx + dir * 8 * s + dir * Math.sin(t * 1.5) * 34 * s
      const py = ky + 34 * s - t * 66 * s
      laurel += leaf(px, py, -Math.PI / 2 + dir * (0.9 - t * 0.3), 14 * s, 4 * s, C.gold, C.gold)
      laurel += leaf(px, py, -Math.PI / 2 - dir * (0.3 - t * 0.2) + (dir > 0 ? 0.4 : -0.4) + 0 * ang, 12 * s, 3.5 * s, 'none', C.gold)
    }
  }
  const year = `<text x="${f(cx)}" y="${f(ky + 72 * s)}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${f(20 * s)}" letter-spacing="${f(8 * s)}" fill="${C.gold}">MMXXVII</text>`
  const note = `<text x="${f(w - 46 * s)}" y="${f(h - 44 * s)}" text-anchor="end" font-family="Georgia, serif" font-size="${f(10 * s + 2)}" fill="${C.line}" opacity="0.5">Placeholder artwork</text>`

  const symbols = arc(R, 2.2 * s + 0.4, 0.95) + arc(R - 9 * s, 0.7, 0.5) + moon + sun + laurel + keyhole + year + note

  return { ground, vines: vinesLayer, bloom: bloomLayer, symbols }
}

const svg = (w, h, inner, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">${inner}</svg>\n`

const LABEL = 'Placeholder for the 2027 House Tapestry'
const variants = {
  desktop: { w: 1600, h: 1000, seed: 2027, R: 300, cy: 430, emblemY: 870, sunMoonY: 150, wide: true },
  mobile: { w: 900, h: 1500, seed: 2027, R: 330, cy: 640, emblemY: 1210, sunMoonY: 190, wide: false },
}

for (const [name, v] of Object.entries(variants)) {
  const layers = compose(v)
  for (const [layer, inner] of Object.entries(layers)) {
    writeFileSync(join(OUT, `2027-${name}-${layer}.svg`), svg(v.w, v.h, inner, `${LABEL}, ${layer} layer`))
  }
  writeFileSync(join(OUT, `2027-${name}.svg`), svg(v.w, v.h, layers.ground + layers.vines + layers.bloom + layers.symbols, LABEL))
}
console.log('wrote tapestry to', OUT)
