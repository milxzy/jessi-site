// placeholder product drawings, used until the house photographs the real pieces.
// the drop designs are stand-ins only; the real chapters have not been shown to us.
// run: node scripts/build-products.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(process.cwd(), 'public/placeholders/products')
mkdirSync(OUT, { recursive: true })

const W = 1200
const H = 1500
const ground = '#ece3d3'
const shade = '#e2d6c2'

const defs = `<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#e9cf95"/><stop offset=".45" stop-color="#b88f4e"/><stop offset=".7" stop-color="#d9b877"/><stop offset="1" stop-color="#8d6a35"/></linearGradient>
<linearGradient id="g2" x1="1" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#f1dcaa"/><stop offset=".5" stop-color="#c49c5a"/><stop offset="1" stop-color="#7f5f2e"/></linearGradient>
<radialGradient id="opal" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#f4f1ea"/><stop offset=".55" stop-color="#d6e4e0"/><stop offset=".8" stop-color="#e8d9dc"/><stop offset="1" stop-color="#c9d8d2"/></radialGradient>
</defs>`

const frame = (inner, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label}">${defs}<rect width="${W}" height="${H}" fill="${ground}"/><ellipse cx="600" cy="1290" rx="300" ry="26" fill="${shade}"/>${inner}<text x="1140" y="1450" text-anchor="end" font-family="Georgia, serif" font-size="22" fill="#8a7458">Placeholder drawing</text></svg>\n`

// a huggie seen at three quarters: a thick ring, its inner edge, the hinge, and the small loop for a drop
function huggie(cx, cy, r, withLoop = true) {
  return `<g>
<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.05}" fill="none" stroke="url(#g)" stroke-width="${r * 0.3}"/>
<ellipse cx="${cx + r * 0.05}" cy="${cy}" rx="${r * 0.86}" ry="${r * 0.9}" fill="none" stroke="#7a5a2b" stroke-width="2" opacity=".35"/>
<path d="M${cx - r * 0.98} ${cy - r * 0.25}a${r} ${r * 1.05} 0 0 1 ${r * 0.6} ${-r * 0.7}" fill="none" stroke="#fff6df" stroke-width="${r * 0.05}" stroke-linecap="round" opacity=".7"/>
<path d="M${cx - r * 0.2} ${cy - r * 1.2}v${r * 0.3}" stroke="#7a5a2b" stroke-width="2" opacity=".5"/>
${withLoop ? `<circle cx="${cx}" cy="${cy + r * 1.2}" r="${r * 0.09}" fill="none" stroke="url(#g2)" stroke-width="${r * 0.045}"/>` : ''}
</g>`
}

const bud = (cx, top) => `<g>
<path d="M${cx} ${top}c-60 70 -78 190 0 260c78 -70 60 -190 0 -260z" fill="url(#g)"/>
<path d="M${cx} ${top + 20}c18 70 18 160 0 230" fill="none" stroke="#7a5a2b" stroke-width="3" opacity=".45"/>
<path d="M${cx} ${top + 260}c-40 -10 -60 -50 -56 -90M${cx} ${top + 260}c40 -10 60 -50 56 -90" fill="none" stroke="url(#g2)" stroke-width="10" stroke-linecap="round"/>
</g>`

const openC = (cx, cy) => `<g>
<path d="M${cx + 86} ${cy - 92}A130 130 0 1 0 ${cx + 86} ${cy + 92}" fill="none" stroke="url(#g)" stroke-width="34" stroke-linecap="round"/>
<circle cx="${cx + 86}" cy="${cy - 92}" r="24" fill="url(#opal)" stroke="#b88f4e" stroke-width="4"/>
</g>`

const bloom = (cx, cy) => {
  const petal = (deg, len, wid, fill) => `<path transform="translate(${cx} ${cy}) rotate(${deg})" d="M0 0C${-wid} ${-len * 0.3} ${-wid * 0.8} ${-len * 0.85} 0 ${-len}C${wid * 0.8} ${-len * 0.85} ${wid} ${-len * 0.3} 0 0Z" fill="${fill}" stroke="#7a5a2b" stroke-width="2" stroke-opacity=".3"/>`
  return [-48, 48, -18, 18].map((d, i) => petal(d, i < 2 ? 190 : 230, 66, 'url(#g2)')).join('') + [-30, 30, 0].map((d, i) => petal(d, i < 2 ? 210 : 240, 60, 'url(#g)')).join('')
}

const link = (x, y1, y2) => `<path d="M${x} ${y1}V${y2}" stroke="#b08746" stroke-width="7"/>`

const files = {
  'huggie.svg': frame(huggie(470, 640, 210) + huggie(780, 760, 150), 'Placeholder drawing of The First Huggie, a fitted gold huggie earring'),
  'huggie-detail.svg': frame(huggie(600, 680, 340), 'Placeholder drawing of The First Huggie seen close, showing the small loop for a Chapters drop'),
  'chapter-the-beginning.svg': frame(huggie(600, 330, 140) + link(600, 498, 560) + bud(600, 560), 'Placeholder drawing of the Chapters drop The Beginning, a closed magnolia bud, hung from The First Huggie'),
  'chapter-the-becoming.svg': frame(huggie(600, 330, 140) + link(600, 498, 610) + openC(640, 760), 'Placeholder drawing of the Chapters drop The Becoming, an open C set with a small opal, hung from The First Huggie'),
  'chapter-the-mother.svg': frame(huggie(600, 330, 140) + link(600, 498, 620) + bloom(600, 940), 'Placeholder drawing of the Chapters drop The Mother, a magnolia in full bloom, hung from The First Huggie'),
}

for (const [name, content] of Object.entries(files)) writeFileSync(join(OUT, name), content)
console.log('wrote products to', OUT)
