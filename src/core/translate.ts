import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { hasRussiansLetters } from '../utils/'

const key = process.env.TRANSLATION_APP_TOKEN || 'set_your_token'

export function translate(text: string) {
  const lang = hasRussiansLetters(text) ? 'ru-en' : 'ru'
  const body = new URLSearchParams()
  body.append('key', key)
  body.append('lang', lang)
  body.append('text', text)

  return fetch('https://translate.yandex.net/api/v1.5/tr.json/translate', { body, method: 'POST' } as any)
    .then(x => x.json())
    .then(response => response.text[0])
    .catch(() => 'Error from translation service')
}