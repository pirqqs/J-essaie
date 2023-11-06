function decryptAndModify(args) {
  args = args
  return args
}
function shuffleArray(args) {
  const length = args.length

  for (let i = length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    // Swap elements at randomIndex and i
    const temp = args[i]
    args[i] = args[randomIndex]
    args[randomIndex] = temp
  }
  return args
}
// // Usage
const initialArray = args
const decryptedAndModifiedArray = decryptAndModify(initialArray)
const jetonScrutateur = shuffleArray(decryptedAndModifiedArray)

// console.log(decryptAndModify(shuffledArray))
// console.log(Functions)
// for (var a = 0; a < length; a++) {
//   return Functions.encodeString(args[a])
// }
return Functions.encodeString(jetonScrutateur)
console.log(jetonScrutateur)
// return Functions.encodeString(decryptedAndModifiedArray[1])

//npx hardhat functions-request --network polygonMumbai --contract 0xF2102dA518e27605AaF8891BD13eAc1936e37ab3 --subid 542
