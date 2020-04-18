// ==UserScript==
// @name         Roll20 Deck/Card Enhancements
// @namespace    roll20enhanced
// @version      0.1
// @description  Adds some quality of life improvements to Decks and Cards for Roll20
// @author       Yulian Kuncheff
// @match        https://app.roll20.net/editor/
// @grant        none
// ==/UserScript==

var r20eDecks = {}
var r20eCards = {}

'use strict';

function populateData() {
//    if (!('r20eDecks' in unsafeWindow)) { unsafeWindow.r20eDecks = {} }
//    if (!('r20eDards' in unsafeWindow)) { unsafeWindow.r20eCards = {} }

    var deckList = Campaign.decks.backboneFirebase.collection.models

    for (var i = 0; i < deckList.length; i++) {
      var deckName = deckList[i].attributes.name
      var deckId = deckList[i].attributes.id
      if (!(deckId in r20eDecks)) {
          r20eDecks[deckId] = {
              cards: {},
              name: deckName
          }
      }
      var cards = deckList[i].cards.models
      for (var j = 0; j < cards.length; j++) {
        var cardName = cards[j].attributes.name
        var cardId = cards[j].attributes.id
        var cardDeck = deckId
        if (!(cardId in r20eCards)) {
            r20eCards[cardId] = {
                name: cardName,
                deck: cardDeck
            }
        }
        r20eDecks[cardDeck].cards[cardId] = {
            name: cardName
        }
      }
    }

    addNameBoxes()
}

function addNameBoxes() {
    [...document.querySelectorAll(`div[data-cardid]`)].each(function(e) {
      var nameSpan = document.createElement("div")
      nameSpan.style.background = "rgba(5, 5, 5, 0.9)"
      nameSpan.style.color = "#dfdfdf"
      nameSpan.style.textAlign = "center"
      nameSpan.style.position = "absolute"
      nameSpan.style.bottom = "0"
      nameSpan.style.width = "100%"
      if ("attributes" in e) {
          var cardId = e.attributes["data-cardid"].value
          var hover = e.querySelector("[class='steal']")
          if (cardId !== "nextcard" && e.querySelector("[data-r20eCard*='true']") === null) {
              nameSpan.innerText = r20eCards[cardId].name
              nameSpan.setAttribute("data-r20eCard", "true")
              if (hover !== null) { hover.style.zIndex=1 }
              e.appendChild(nameSpan)
          }
      }
    });
}

function setupObservers() {
    console.log("Setting up observers")
    // Select the node that will be observed for mutations
    //const targetNodes = [...document.querySelectorAll(`div[class*='handcontainer']`)];

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                addNameBoxes();
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations

    observer.observe(document.body, config);
}

setTimeout(setupObservers, 10000);

setTimeout(populateData, 5000);