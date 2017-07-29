const helper = require('../../utils')

const enRu = {
  'Q': 'Й',
  'W': 'Ц',
  'E': 'У',
  'R': 'К',
  'T': 'Е',
  'Y': 'Н',
  'U': 'Г',
  'I': 'Ш',
  'O': 'Щ',
  'P': 'З',
  'A': 'Ф',
  'S': 'Ы',
  'D': 'В',
  'F': 'А',
  'G': 'П',
  'H': 'Р',
  'J': 'О',
  'K': 'Л',
  'L': 'Д',
  'Z': 'Я',
  'X': 'Ч',
  'C': 'С',
  'V': 'М',
  'B': 'И',
  'N': 'Т',
  'M': 'Ь',
  'q': 'й',
  'w': 'ц',
  'e': 'у',
  'r': 'к',
  't': 'е',
  'y': 'н',
  'u': 'г',
  'i': 'ш',
  'o': 'щ',
  'p': 'з',
  '[': 'х',
  ']': 'ъ',
  'a': 'ф',
  's': 'ы',
  'd': 'в',
  'f': 'а',
  'g': 'п',
  'h': 'р',
  'j': 'о',
  'k': 'л',
  'l': 'д',
  ';': 'ж',
  '\'': 'э',
  'z': 'я',
  'x': 'ч',
  'c': 'с',
  'v': 'м',
  'b': 'и',
  'n': 'т',
  'm': 'ь',
  ',': 'б',
  '.': 'ю',
  '/': '.',
  '&': '?',
}

const ruEn = Object.keys(enRu).reduce((obj, key) => {
  obj[enRu[key]] = key
  return obj
}, {})

module.exports = text => {
  const charsToSwitch = helper.hasRussiansLetters(text) ? ruEn : enRu
  if (text.split) {
    return text.split('').map(char => charsToSwitch[char] ? charsToSwitch[char] : char).join('')
  }
  return text
}
