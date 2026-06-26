import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TokenProvider } from './components/context/TokenContext.tsx'
import { FilterProvider } from './components/context/FilterContext.tsx'
import { AudioProvider } from './components/context/AudioContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AudioProvider>
      <FilterProvider>
        <TokenProvider>
          <App />
        </TokenProvider>
      </FilterProvider>
    </AudioProvider>
  </StrictMode>,
)
