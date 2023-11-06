// SPDX-License-Identifier: MIT
// La directive SPDX-License-Identifier indique la licence sous laquelle ce contrat est publié.

pragma solidity ^0.8.19;
// La version du compilateur Solidity utilisée.

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

// Importation de différentes bibliothèques et contrats depuis les dépendances.

/**
 * @title Exemple de contrat consommateur de fonctions Chainlink à la demande
 */
contract FunctionsConsumerScrutateur is FunctionsClient, ConfirmedOwner {
  // Le contrat FunctionsConsumer hérite de FunctionsClient et ConfirmedOwner.

  using FunctionsRequest for FunctionsRequest.Request;
  // Utilisation de la bibliothèque FunctionsRequest pour les requêtes.

  bytes32 public donId;
  // Identifiant de la DON (Decentralized Oracle Network) utilisé pour les requêtes.

  bytes32 public s_lastRequestId;
  // Dernier ID de requête effectuée.

  bytes public s_lastResponse;
  // Dernière réponse reçue.

  bytes public s_lastError;
  // Dernière erreur reçue.

  string[] public jetonCommencePar1;
  // Tableau des nombres commençant par "1".

  string[] public jetonCommencePar2;

  // Tableau des nombres commençant par "2".

  constructor(address router, bytes32 _donId) FunctionsClient(router) ConfirmedOwner(msg.sender) {
    // Constructeur du contrat FunctionsConsumer.

    donId = _donId;
    // Initialisation de l'identifiant de la DON.
  }

  /**
   * @notice Définir l'ID de la DON
   * @param newDonId Nouvel ID de DON
   */
  function setDonId(bytes32 newDonId) external onlyOwner {
    // Fonction pour définir l'ID de la DON, accessible uniquement par le propriétaire.

    donId = newDonId;
    // Mise à jour de l'ID de la DON.
  }

  /**
   * @notice Déclenche une demande de fonctions en utilisant des secrets chiffrés à distance
   * @param source Code source JavaScript
   * @param secretsLocation Emplacement des secrets (uniquement Location.Remote et Location.DONHosted sont pris en charge)
   * @param encryptedSecretsReference Référence pointant vers les secrets chiffrés
   * @param args argumetns sous forme de string passés dans le code source et accesible via la variable globale `args`
   * @param bytesArgs Arguments sous forme de chaînes de caractères passés dans le code source et accessibles via la variable globale `bytesArgs` sous forme de chaînes hexadécimales
   * @param subscriptionId ID d'abonnement utilisé pour payer la demande (l'adresse du contrat FunctionsConsumer doit d'abord être ajoutée à l'abonnement)
   * @param callbackGasLimit Limite de gas maximale utilisée pour appeler la méthode héritée `handleOracleFulfillment`
   */

  function sendRequestScrutateur(
    string calldata source,
    FunctionsRequest.Location secretsLocation,
    bytes calldata encryptedSecretsReference,
    string[] calldata args,
    bytes[] calldata bytesArgs,
    uint64 subscriptionId,
    uint32 callbackGasLimit
  ) external onlyOwner {
    // Vérifie que le nombre d'arguments est supérieur à 5 pour des raisons d'anonymat.

    FunctionsRequest.Request memory req;
    req.initializeRequest(FunctionsRequest.Location.Inline, FunctionsRequest.CodeLanguage.JavaScript, source);
    req.secretsLocation = secretsLocation;
    req.encryptedSecretsReference = encryptedSecretsReference;
    req.setArgs(args);
    // Prépare une demande de fonctions à la demande avec les paramètres spécifiés.

    if (bytesArgs.length > 0) {
      req.setBytesArgs(bytesArgs);
    }

    s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, callbackGasLimit, donId);
    // Envoie la demande de fonctions à la demande et stocke l'ID de la demande.
  }

  /**
   * @notice Stocke le dernier résultat/erreur
   * @param requestId L'ID de la demande, renvoyé par sendRequest()
   * @param response Réponse agrégée du code utilisateur
   * @param err Erreur agrégée du code utilisateur ou de la chaîne d'exécution
   * Soit la réponse, soit le paramètre d'erreur sera défini, mais jamais les deux à la fois
   */
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    s_lastResponse = response;
    s_lastError = err;
    s_lastRequestId = requestId;
    // Stocke la réponse ou l'erreur de la dernière demande de fonctions à la demande.
  }

  function getLastResponseAsString() public view returns (string memory) {
    bytes memory response = s_lastResponse;
    string memory responseStr = string(response);
    return responseStr;
  }

  function scruteJeton() external {
    uint256 length = s_lastResponse.length;
    uint256 i = 0;

    while (i < length) {
      bytes1 premierCar = s_lastResponse[i];
      // Lit le premier caractère.

      if (premierCar >= bytes1("0") && premierCar <= bytes1("9")) {
        // Vérifie si c'est un chiffre et qu'il est compris entre '0' et '9'.

        bytes memory jetonBytes = new bytes(2);
        jetonBytes[0] = premierCar;
        jetonBytes[1] = s_lastResponse[i + 1];
        string memory jetonString = string(jetonBytes);
        // Extrait le nombre à deux chiffres.

        if (premierCar == bytes1("1")) {
          jetonCommencePar1.push(jetonString);
        } else if (premierCar == bytes1("2")) {
          jetonCommencePar2.push(jetonString);
        }
        // Ajoute le nombre au tableau approprié en fonction du premier caractère.

        i += 65;
      } else {
        i++;
      }
    }
  }

  function voirVoteA() public view returns (string[] memory) {
    return jetonCommencePar1;
    // Renvoie le tableau des nombres commençant par "1".
  }

  function voirVoteB() public view returns (string[] memory) {
    return jetonCommencePar2;
    // Renvoie le tableau des nombres commençant par "2".
  }
}
