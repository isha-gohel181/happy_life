// Browser shim: provide `global` for libs that expect Node's global
if (typeof globalThis.global === 'undefined') {
  globalThis.global = globalThis;
}

import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'

// React 19 Compatibility Shim for Zoom SDK
// In React 19, __SECRET_INTERNALS... is fully undefined — we must create it directly on React.
if (!React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
    ReactCurrentOwner: { current: null },
    ReactCurrentBatchConfig: { transition: null },
    ReactCurrentDispatcher: { current: null },
  };
} else {
  const si = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  if (!si.ReactCurrentOwner) si.ReactCurrentOwner = { current: null };
  if (!si.ReactCurrentBatchConfig) si.ReactCurrentBatchConfig = { transition: null };
  if (!si.ReactCurrentDispatcher) si.ReactCurrentDispatcher = { current: null };
}

import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import './index.css'
import App from './App.jsx'
import { connectSocket } from './redux/slices/chat'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1234567890-dummyclientid.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)

// Auto-connect socket if we have a stored token
const token = localStorage.getItem('edrilla_token');
if (token) {
  store.dispatch(connectSocket());
}
