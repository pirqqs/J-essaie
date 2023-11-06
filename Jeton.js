const forge = require("node-forge")
const crypto = require("crypto")
const JSEncrypt = require("nodejs-jsencrypt").default

const publicKeyScrutateur =
  "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDY0xIs5oSVl8dxCW4zDTtIdtfOVMjT8bI6l6tDb3BW6HSIAXqEsp6wfeVHJ+7LHFDGSn4TrURpL6FFKHPz7EVzZrcZjNU+jn8l2W9hDXnFc/v3qR3SRXuG71ZUiCP3g8j1SdY+sB0Yn0046PdFiWrIX8qiqMpNX2fHiJH5uq71/QIDAQAB-----END PUBLIC KEY-----"

const publicKeyCroupier =
  "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwf5Im2QNPKWjPVl8JqHBbw4JiSuuyzk6onv+Y30nrjK4NjUoOeCux0lSQupEdVNfl9Hsr5oUyDZJ8GAWL7TlhPxTmXNfZQUAJGCLOAbUDlPLyqGNg7o4hEfw5ouCdEdcUyw9lycyGuyDix8xX9GXRsj1prg1roTbKcmc7deZ4jjg8Ddty6m4aY0m/PbtXO22NwsuJgRfQvjofhPNEGqt1Ch2hE0xCkNt9nkZBxipC8a2M69Z+qfNgyUVRyvhitetJNyAojnAzQ7nfTE/IWCek5eKjYOp3lS/trZ1vgDZvu/d3/Rn08pJdtgsE5fzTeeKmaDpcSslrE3ZEoF7kATqDwIDAQAB-----END PUBLIC KEY-----"

// Fonction pour avoir Jeton
function creerJeton(Choix_Vote, N_V, numeroDeCarteDid) {
  const jetonArray = []
  // Créer une liste de Jeton pour simuler une votation / Si on veut qu'un seul Jeton, enlever for(){} loop
  for (var i = 0; i < 5; i++) {
    // Avoir deux nombre completement aleatoire
    let randomAnonymeNumber1 = crypto.getRandomValues(new Uint32Array(1))[0]
    let randomAnonymeNumber2 = crypto.getRandomValues(new Uint32Array(1))[0]
    // Avoir un nombre unique a chaque Citoyen
    // let uniqueNumber = "12345678910";
    // Mettre ensemble le nombre aleatoire et unique pour cree un nombre 100% aleatoire et unique
    let uniqueRandomValue = `${numeroDeCarteDid}${randomAnonymeNumber2}${randomAnonymeNumber1}`
    // hash uniqueRandomValue pour avoir le Jeton brute
    const JetonBrute = crypto.createHash("sha256").update(uniqueRandomValue).digest("hex")
    // Mettre ensemble les donne necessaire pour avoir le Jeton
    let jeton = `${Choix_Vote}${JetonBrute}${N_V}`
    jetonArray.push(jeton)
  }
  return jetonArray
}
// Définir Jeton
const jeton = creerJeton(1, 2, "12345678910")
console.log("Jeton créé  :", jeton)

// Fonction pour encrypter le Jeton avec la clé publique du Casting
function encryptScrutateur(Jeton) {
  const encryptedJeton = []
  for (var i = 0; i < Jeton.length; i++) {
    // Assemblé le Jeton avec un numero aléatoire
    const jeton_R1 = `${Jeton[i]}${String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000000).padStart(9, "0")}`
    // Incier JSEncrypt pour chiffré avec le système RSA
    var encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKeyScrutateur)
    // Chiffrer Jeton+R1 avec la clé publique du Scrutateur
    const scrutateurJeton = encrypt.encrypt(jeton_R1)
    encryptedJeton.push(scrutateurJeton)
  }
  return encryptedJeton
}
// Définir (J+R1)Pub_Scrutateur comme scrutateurJeton
const scrutateurJeton = encryptScrutateur(jeton)

// Fonction pour assemblé (Jeton+R1)Pu_Scrutateur avec R2
// et chiffré le (Jeton+R1)PuScrutateur+R2 avec la clé publique du Croupier
function encryptCroupier() {
  const croupierJeton = []
  for (var i = 0; i < scrutateurJeton.length; i++) {
    // Assemblé (Jeton+R1)Pu_Scrutateur avec R2
    const jeton_R2 = `${scrutateurJeton[i]}${String(
      crypto.getRandomValues(new Uint32Array(1))[0] % 1000000000
    ).padStart(9, "0")}`
    // Incier JSEncrypt pour chiffré avec le système RSA
    var encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKeyCroupier)
    // Chiffré (Jeton+R1)PuScrutateur+R2 avec la clé publique du Croupier
    const scrutateurCroupierJeton = encrypt.encrypt(jeton_R2)
    croupierJeton.push(scrutateurCroupierJeton)
  }
  return croupierJeton
}
// const CastingRandomizedJeton = encryptRandomizer().toString();
const croupierJeton = encryptCroupier()

console.log("Le même Jeton doublement chiffrées", croupierJeton)

module.exports = {
  croupierJeton,
  creerJeton,
  encryptScrutateur,
  encryptCroupier,
}

/*/ pierre@Henris-MacBook-Pro-2018 functions-hardhat-starter-kit % curl -fsSL https://deno.land/x/install/install.sh | sh
######################################################################## 100.0%
Archive:  /Users/pierre/.deno/bin/deno.zip
  inflating: /Users/pierre/.deno/bin/deno  
Deno was installed successfully to /Users/pierre/.deno/bin/deno
Manually add the directory to your $HOME/.zshrc (or similar)
  export DENO_INSTALL="/Users/pierre/.deno"
  export PATH="$DENO_INSTALL/bin:$PATH"
Run '/Users/pierre/.deno/bin/deno --help' to get started

Stuck? Join our Discord https://discord.gg/deno
*/
