// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseDeDonneesMotsDePasses.sol";
import "./BaseDeDonneesAdressesVerifiees.sol";

/**
 * @title Identification
 * @dev Contrat pour l'identification des utilisateurs en vérifiant les mots de passe et les adresses.
 */
contract Identification is DataBaseMotsDePasses, DataBaseAdressesVerifiees {
  address public owner;

  error motDePasseOuAdresseInvalide();
  error motDePasseInvalide();
  error adresseDejaVerifiee();

  constructor(address _adresseEID, address _adresseEA) {
    owner = msg.sender;
    initialize(_adresseEID, _adresseEA);
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Seul le propriwtaire peut appeler cette fonction");
    _;
  }

  function initialize(address _adresseEID, address _adresseEA) private {
    adresseEID = _adresseEID;
    adresseEA = _adresseEA;
  }

  function addVerifiedAddress(address adresseEnAttente) public {
    require(adresseVerifiee(adresseEnAttente), "Adresse deja verifiee");
    require(msg.sender == adresseEID, "Seul l'emetteur d'identite peut appeler cette fonction");
    adresseVerifie.push(adresseEnAttente);
  }
}
