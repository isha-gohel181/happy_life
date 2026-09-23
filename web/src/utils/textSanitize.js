// Lightweight display sanitization: fix common typos, normalize whitespace, title-case.
export function sanitizeDisplay(input) {
  if (!input && input !== '') return input
  let s = String(input)
  // don't touch URLs or image paths
  if (/^https?:\/\//i.test(s) || /^\//.test(s) || /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(s)) return s

  s = s.trim()
  // common misspellings
  const corrections = {
    'soloprenuemner': 'solopreneur',
    'soloprenuer': 'solopreneur',
    'solopreuner': 'solopreneur',
    'soloprenur': 'solopreneur'
  }
  Object.keys(corrections).forEach(k => {
    const re = new RegExp(k, 'gi')
    s = s.replace(re, corrections[k])
  })

  // replace HTML entities &nbsp; &amp; etc.
  s = s.replace(/&nbsp;|\u00A0/g, ' ').replace(/&amp;/g, '&')
  // normalize punctuation/whitespace
  s = s.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()

  // Title case for multi-word short labels or headings
  s = s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return s
}

export default sanitizeDisplay
