import { Route, Routes } from 'react-router-dom'
import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/manrope'
import '@fontsource/special-elite/400.css'
import './tokens.css'
import Home from './Home'
import House from './House'
import { JournalEntry, JournalIndex } from './Journal'
import { Layout } from './Layout'
import NotFound from './NotFound'
import { BagPage, Care, Checkout, Legal } from './Service'
import { Chapters, Heirlooms, Huggie } from './Shop'
import TapestryPage from './TapestryPage'

export default function DesignB() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="house" element={<House />} />
        <Route path="heirlooms" element={<Heirlooms />} />
        <Route path="heirlooms/the-first-huggie" element={<Huggie />} />
        <Route path="heirlooms/chapters" element={<Chapters />} />
        <Route path="journal" element={<JournalIndex />} />
        <Route path="journal/:handle" element={<JournalEntry />} />
        <Route path="tapestry" element={<TapestryPage />} />
        <Route path="care" element={<Care />} />
        <Route path="bag" element={<BagPage />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="legal/:handle" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
