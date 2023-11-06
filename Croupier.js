const JSEncrypt = require("nodejs-jsencrypt").default
const crypto = require("crypto")
const { croupierJeton } = require("./Jeton.js")
require("@chainlink/env-enc").config()

const args = croupierJeton

const PRIVATE_KEY_CROUPIER = process.env.PRIVATE_KEY_CROUPIER
if (!PRIVATE_KEY_CROUPIER) {
  console.error("PRIVATE_KEY_CROUPIER n'est pas définie")
  process.exit(1)
}
// Fonction pour mélanger les différents Jeton chiffré
function shuffleArray() {
  for (let i = args.length - 1; i > 0; i--) {
    // Genere un index aléatoire entre 0 et 1 (inclus)
    const randomIndexBytes = crypto.randomBytes(4)
    const randomIndex = Math.floor((randomIndexBytes.readUInt32LE(0) / 0xffffffff) * (i + 1))
    // Interchanger les éléments à randomindex et
    const temp = args[i]
    args[i] = args[randomIndex]
    args[randomIndex] = temp
  }
  return args
}

const shuffledArray = shuffleArray()

// Fonction pour déchiffrer le Jeton avec la clé privé du Croupier
// et pour ne retirer R2 du Jeton chiffré
function decryptCroupier() {
  const scrutateurJeton_R = []
  for (let i = 0; i < shuffledArray.length; i++) {
    // Incier JSEncrypt pour déchiffré avec le système RSA
    var decrypt = new JSEncrypt()
    decrypt.setPrivateKey(PRIVATE_KEY_CROUPIER)
    // Dechiffré avec la clé privé du Croupier le Jeton
    var uncrypted = decrypt.decrypt(shuffledArray[i])
    scrutateurJeton_R.push(uncrypted)
  }

  return scrutateurJeton_R
}

const scrutateurJeton_R = decryptCroupier()

// Fonction pour retirer R2 de J
function sliceJeton() {
  const jeton = []
  for (var i = 0; i < scrutateurJeton_R.length; i++) {
    // retirer R2 pour obtenir (J+R1)Pub_Scrutateur
    const jetonDésassembler = scrutateurJeton_R[i].slice(0, scrutateurJeton_R[i].length - 9)
    jeton.push(jetonDésassembler)
  }
  return jeton
}

// Définir (J+R1)Pub_Scrutateur comme ScrutateurJeton
const scrutateurJeton = sliceJeton()
// console.log(ScrutateurJeton)
module.exports = { scrutateurJeton }

/* 
Scrutateur
-----BEGIN RSA PRIVATE KEY-----MIICXQIBAAKBgQDY0xIs5oSVl8dxCW4zDTtIdtfOVMjT8bI6l6tDb3BW6HSIAXqEsp6wfeVHJ+7LHFDGSn4TrURpL6FFKHPz7EVzZrcZjNU+jn8l2W9hDXnFc/v3qR3SRXuG71ZUiCP3g8j1SdY+sB0Yn0046PdFiWrIX8qiqMpNX2fHiJH5uq71/QIDAQABAoGBAKg0LgBpH+fQ5Ca7syKlnBzeHRJy0Y0iDirIKFNbKyIwmN49j2dMDjFKqUhnISeuIreBaIcpPk3/ZjN5a2KKI2EyfY/QZCsWrLCg/WrULoNeJKhOV7sAbM2bF3752FBO044THRrWG0rEmUWW7QU1+8xfUUWpo95WTNExz7wr4fChAkEA7Ct6Zz8UnmMtOvEUj+Em6M0/KRmoPtY85UgLXC/Id3pW+4bkRiZ6BMPUERQTo41oiNTX3n02hpsyHVykx5xnSQJBAOsHwrTWCg9o60/6Q49b5+ZWJmFpV4ToLZXV3B7Pa5TyI/Rkw3gv/MeP7Hu/laRruxLlrJqhFAlMZwUyy0vVlRUCQDzzk6ml3BpsmjXGFnpzr2kR36Up3AQropfCGjx2kJRVXLGZxLxeHcuxBsBJoC/rxPjbhcMEKdhfoXV2fYiO0xECQQCmseBlBhIoj8+l7+iO+y5k7eFW4bITL+F1DjOLHq48++iIZBdHXTG6ENg3hNCLx2TtqDxdh7WAStIem8IYzSlpAkBkBlJAFDfFnhhO1pwAfBipgsIp4oGDyiBb1U/OWbfl5AcuBWLe3vYrrXRErY4vUhxv4qsUyIZOtrAL8RKkT+lm-----END RSA PRIVATE KEY-----
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDY0xIs5oSVl8dxCW4zDTtIdtfO
VMjT8bI6l6tDb3BW6HSIAXqEsp6wfeVHJ+7LHFDGSn4TrURpL6FFKHPz7EVzZrcZ
jNU+jn8l2W9hDXnFc/v3qR3SRXuG71ZUiCP3g8j1SdY+sB0Yn0046PdFiWrIX8qi
qMpNX2fHiJH5uq71/QIDAQAB
-----END PUBLIC KEY-----
*/
/* 
Croupier
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAwf5Im2QNPKWjPVl8JqHBbw4JiSuuyzk6onv+Y30nrjK4NjUo
OeCux0lSQupEdVNfl9Hsr5oUyDZJ8GAWL7TlhPxTmXNfZQUAJGCLOAbUDlPLyqGN
g7o4hEfw5ouCdEdcUyw9lycyGuyDix8xX9GXRsj1prg1roTbKcmc7deZ4jjg8Ddt
y6m4aY0m/PbtXO22NwsuJgRfQvjofhPNEGqt1Ch2hE0xCkNt9nkZBxipC8a2M69Z
+qfNgyUVRyvhitetJNyAojnAzQ7nfTE/IWCek5eKjYOp3lS/trZ1vgDZvu/d3/Rn
08pJdtgsE5fzTeeKmaDpcSslrE3ZEoF7kATqDwIDAQABAoIBAEw38SUEYWMDnShc
gTfYc9yDQmHfhNSZzpzKZL+IC9AYY2IA7qYWzfTErQpXasBCGpvWwcyYmDO1iMVl
qzHhPBBM5zeyKbfSCCVCvVAs9qIOcFJTuPsZbl0iutaJ156B7xdKmYRKxRfo9yHx
BoAkI/COwl1XoNfJoSZA7WRRQker7A9sQ2OKX08Zn3x4UCCzjRhkGe0woX1TuYim
DpwNYQkSNcgMUZ+H3MR7Wes0lE8fo6U6eLRY0KtouYZHp0bFU4oOoiwaWgQneNvK
+9/BhPCmrcgQt3CWRIjyv5u4qAUhkNQhqCYQcPEj9JsFRkSQS47xPHsMcg1id5yM
oOjW+pECgYEA52vM7W2v8L0Hj37fGbQKmh0sv6NEE5fDfb9xc8Qbgz28GH5ga513
jR7Xf2dXwJGpD7pRIVAEXF9S4fF5fSbDWiO9Uuf67Mn9cbSx1BYVCLoEI9L8tp/K
bMbsLXKqgNDbOD95AT8PBcD1H4eZc9060PdKukC2osKlF9Ys31mrALkCgYEA1pjY
CSmxQOxpIa1mVXlY2La+bL+DDiMoixUssOg2QqxDhDprGWXSd4qwGgf2SEW9vaaI
tGsIkC/d9nWCiP5gFIi9n8a/VskpDXpGS0BzseeoWuFQ/8c/YQM5ZmyZ3fKrCDdR
uv4Sjm4GtDsqcG3bASpY2sSNyxCCBTMubYeCjQcCgYBTrJacAlzrHm3tZGImWQK8
VnAnmlCzBNyaSu4qfW21Nk0cThVu07C2RcCFQEhqSEBof2V2NghdndnJ+BWFOs7H
eMSrhVUk6KPKyRrDJHjWfuugSFk3bu8yBXq/tAYSLXIWFF0cJkC4Q9xdWhoR2pu5
krBiR6PBlb87ryTqXPGHgQKBgQCwPYCXLd18A2xoEx+LLQiRmquTZkk8kBVY/D/i
3iLJ6O3eJ5gTmLMcKBNunYFfY59rpNx6x7iVqioxodpdpgPEeXS6RqCXpseHYRdf
8APUZPu3/3nlRn6/rsUyYBiR1h0utzfxSX516Niqpji5cw88ysmEiY4l6l3N5XXI
0FSgewKBgQC7YQTZDO/BaSmFuOfAS4tzHJ4a1VpxpuHkq1GbIta4COsNPJQm1Bun
XpoiEhbEONAxhM+V/2viXaJSEe+uPogjGRrHJ/G1ByxV8GgEfOcGl20pHSaoQRl3
l0Ghlxsgs0vRgdJpKfvvaONFp+l5rEhcEQkTzht6W95jgzSAa3rblA==
-----END RSA PRIVATE KEY-----
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwf5Im2QNPKWjPVl8JqHB
bw4JiSuuyzk6onv+Y30nrjK4NjUoOeCux0lSQupEdVNfl9Hsr5oUyDZJ8GAWL7Tl
hPxTmXNfZQUAJGCLOAbUDlPLyqGNg7o4hEfw5ouCdEdcUyw9lycyGuyDix8xX9GX
Rsj1prg1roTbKcmc7deZ4jjg8Ddty6m4aY0m/PbtXO22NwsuJgRfQvjofhPNEGqt
1Ch2hE0xCkNt9nkZBxipC8a2M69Z+qfNgyUVRyvhitetJNyAojnAzQ7nfTE/IWCe
k5eKjYOp3lS/trZ1vgDZvu/d3/Rn08pJdtgsE5fzTeeKmaDpcSslrE3ZEoF7kATq
DwIDAQAB
-----END PUBLIC KEY-----
*/
