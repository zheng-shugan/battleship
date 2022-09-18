import { useState, createContext } from 'react'
import { IntlProvider } from 'react-intl'
import Chinese from '../../lang/zh-CN.json'
import English from '../../lang/en-US.json'

export const Context = createContext(null)

export const local = navigator.language
let lang
if (local === 'zh-CN') {
  lang = Chinese
} else {
  lang = English
}

const Wrapper = ({ children }) => {
  const [locale, setLocale] = useState(local)
  const [messages, setMessages] = useState(lang)

  // Select language
  const selectLanguage = (e) => {
    const language = e.target.value

    setLocale(language)
    if (language === 'zh-CN') {
      setMessages(Chinese)
    } else {
      setMessages(English)
    }
  }

  return (
    <Context.Provider value={{ locale, selectLanguage }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </Context.Provider>
  )
}

export default Wrapper