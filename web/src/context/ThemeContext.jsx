import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
})

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light')

  useEffect(() => {
    try {
      localStorage.setItem('edrilla_theme', 'light')
    } catch (e) {
      console.warn('Failed to save theme in localStorage', e)
    }

    const root = document.documentElement
    root.classList.add('light')
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }, [theme])

  const toggleTheme = () => {
    // Keep theme light permanently as requested
    setThemeState('light')
  }

  const setTheme = (newTheme) => {
    setThemeState('light')
  }

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
export default ThemeContext
