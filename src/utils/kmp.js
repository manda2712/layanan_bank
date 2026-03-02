function buildLPS (pattern) {
  const lps = Array(pattern.length).fill(0)
  let length = 0
  let i = 1

  while (i < pattern.length) {
    if (pattern[i] === pattern[length]) {
      length++
      lps[i] = length
      i++
    } else {
      if (length !== 0) {
        length = lps[length - 1]
      } else {
        lps[i] = 0
        i++
      }
    }
  }
  return lps
}

function kmpSearch (text, pattern) {
  const lps = buildLPS(pattern)
  let i = 0,
    j = 0

  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++
      j++
    }

    if (j === pattern.length) {
      return true
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1]
      } else {
        i++
      }
    }
  }

  return false
}

module.exports = { kmpSearch }
