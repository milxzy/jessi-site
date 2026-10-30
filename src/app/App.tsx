import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from '@/shared/commerce'
import { ScrollToTop } from '@/shared/lib/scroll'
import { ConceptPicker } from './ConceptPicker'
import { ConceptSwitcher } from './ConceptSwitcher'

// each concept is its own chunk, so its fonts, css and components load only when visited
const A = lazy(() => import('@/concepts/a'))
const B = lazy(() => import('@/concepts/b'))
const C = lazy(() => import('@/concepts/c'))
const D = lazy(() => import('@/concepts/d'))

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CartProvider>
        <ScrollToTop />
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<ConceptPicker />} />
            <Route path="/a/*" element={<><A /><ConceptSwitcher current="a" /></>} />
            <Route path="/b/*" element={<><B /><ConceptSwitcher current="b" /></>} />
            <Route path="/c/*" element={<><C /><ConceptSwitcher current="c" /></>} />
            <Route path="/d/*" element={<><D /><ConceptSwitcher current="d" /></>} />
            <Route path="*" element={<ConceptPicker />} />
          </Routes>
        </Suspense>
      </CartProvider>
    </BrowserRouter>
  )
}
