const JSEncrypt = require("nodejs-jsencrypt").default
const crypto = require("crypto")
const { scrutateurJeton } = require("./Croupier.js")
require("@chainlink/env-enc").config()

const PRIVATE_KEY_SCRUTATEUR = process.env.PRIVATE_KEY_SCRUTATEUR
if (!PRIVATE_KEY_SCRUTATEUR) {
  console.error("PRIVATE_KEY_CROUPIER n'est pas définie")
  process.exit(1)
}

// Fonction pour dechiffré (J+R)Pub_Scrutateur avec la clé pirvée du Scrutateur
function dechiffreScrutateurJeton() {
  const jeton_R = []
  for (var i = 0; i < scrutateurJeton.length; i++) {
    // Incier JSEncrypt pour déchiffré avec le système RSA
    var decrypt = new JSEncrypt()
    decrypt.setPrivateKey(PRIVATE_KEY_SCRUTATEUR)
    // Déchiffer (J+R)_Pub_Scrutateur avec clé privée
    var uncrypted = decrypt.decrypt(scrutateurJeton[i])
    jeton_R.push(uncrypted)
  }
  return jeton_R
}

// Définir J+R comme Jeton_R
const jeton_R = dechiffreScrutateurJeton()
// console.log(Jeton_R);

//Fonction pour retirer R de J+R
function sliceJeton() {
  const jeton_Array = []
  for (var i = 0; i < jeton_R.length; i++) {
    //retirer R de J+R pour obtenir J
    const jeton = jeton_R[i].slice(0, jeton_R[i].length - 9)
    jeton_Array.push(jeton)
  }
  return jeton_Array
}
// Définir J comme Jeton
const jeton = sliceJeton()
console.log(jeton)
module.exports = { jeton }
