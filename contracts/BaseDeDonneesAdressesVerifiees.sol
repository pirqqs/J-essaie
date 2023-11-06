// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DataBaseAdressesVerifiees
 * @dev Contrat pour la gestion des adresses vérifiées.
 */

contract DataBaseAdressesVerifiees {
  address[] public adresseVerifie;
  address public adresseEA;

  function ajouterAdresseVerifiee(address adresse) public {
    if (!adresseVerifiee(adresse)) {
      adresseVerifie.push(adresse);
    }
  }

  function adresseVerifiee(address adresse) public view returns (bool) {
    for (uint i = 0; i < adresseVerifie.length; i++) {
      if (adresseVerifie[i] == adresse) {
        return true;
      }
    }
    return false;
  }

  function voirAdresseVerifie() public view returns (address[] memory) {
    return adresseVerifie;
  }
}
