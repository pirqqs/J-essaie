// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DataBaseMotsDePasses
 * @dev Contrat pour la gestion des mots de passe.
 */
contract DataBaseMotsDePasses {
  uint256[] private motsDePasses;
  address public adresseEID;
  address public adresseEA;

  constructor(address _adresseEID, address _adresseEA) {
    adresseEID = _adresseEID;
    adresseEA = _adresseEA;
  }

  modifier seulementEID() {
    require(msg.sender == adresseEID, "Seul l'emetteur d'identite peut appeler cette fonction");
    _;
  }

  modifier seulementEA() {
    require(msg.sender == adresseEA, "Seule l'entite d'authentification peut appeler cette fonction");
    _;
  }

  function ajouterMotDePasse(uint256 nouveauMotDePasse) public seulementEID {
    if (!motDePasseExiste(nouveauMotDePasse)) {
      motsDePasses.push(nouveauMotDePasse);
    }
  }

  function voirMotsDePasses() public view seulementEA returns (uint256[] memory) {
    return motsDePasses;
  }

  function motDePasseExiste(uint256 motDePasse) private view returns (bool) {
    for (uint i = 0; i < motsDePasses.length; i++) {
      if (motsDePasses[i] == motDePasse) {
        return true;
      }
    }
    return false;
  }
}
