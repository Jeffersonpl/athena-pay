import React from 'react'

export function useTheme(){
  const get = () => (localStorage.getItem('theme') as 'light'|'dark'|null) || 'light'
  const [theme, setTheme] = React.useState<'light'|'dark'>(get())
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])
  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  return { theme, setTheme, toggle }
}
