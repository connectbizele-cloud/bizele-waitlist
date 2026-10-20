import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RoleProvider } from './context/RoleContext'
import { CookieConsentProvider } from './context/CookieConsentContext'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookieConsentProvider>
      <RoleProvider>
        <App />
      </RoleProvider>
    </CookieConsentProvider>
  </StrictMode>,
)
