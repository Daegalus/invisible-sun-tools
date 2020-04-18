// ==UserScript==
// @name        Roll20 Deck Creator
// @namespace   Daegalus
// @description Creates a deck in one click based on preuploaded images from My Library. Forked from feoff3's repo
// @include     https://app.roll20.net/editor/
// @version     1
// @grant       none
// ==/UserScript==


var zNode;
var deckButton;
var deckList;
var folderList;
var imageRegExpInput;

var linkToAssets = "https://app.roll20.net/image_library/fetchorphanassets/false/";
var linkToFolder = "https://app.roll20.net/image_library/fetchlibraryfolder/"
var linkToRoot = "https://app.roll20.net/image_library/fetchroot"

// Helper functions to load data from the Library

// Load JSON text from server hosted file and return JSON parsed object
function loadJSON(filePath) {
    // Load json file;
    var json = loadTextFileAjaxSync(filePath, "application/json");
    // Parse json
    return JSON.parse(json);
}

// Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileAjaxSync(filePath, mimeType)
{
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",filePath,false);
    if (mimeType != null) {
        if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType(mimeType);
        }
    }
    xmlhttp.send();
    if (xmlhttp.status==200)
    {
        return xmlhttp.responseText;
    }
    else {
        // TODO Throw exception
        return null;
    }
}

// Functions that define behaviour of our mini-extension

function ButtonClickAction (zEvent) {


    var regexp = new RegExp(imageRegExpInput.value);
    var deck_no = deckList.selectedIndex;
    var folder = folderList.value;
    // reads every page of the library till it finds an empty page

    var folderData = loadJSON(linkToFolder+folder);
    // search this library parts for files that match regexp and add them to the deck
    console.log("Folder Size " + folderData.length)
    console.log(folderData);
    for (var j = 0 ; j < folderData.length ; j++) {
        if (regexp.test(folderData[j].n) && folderData[j].t == "item") {
            var link = folderData[j].fullsize_url.replace("/max" , "/med"); // we change the link from max fullsize to med as med link is used for cards internally by roll20
            var name = folderData[j].n.split('.')[1]
            name = name.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');//replace(".jpg" , "").replace(".png" , "");
            Campaign.decks.backboneFirebase.collection.models[deck_no].cards.create( {name:name , avatar:link} )
        }
    }
}

function addButton()
{
    zNode = document.createElement ('div');
    zNode.innerHTML = '<div><button id="myDeckButton" type="button">Create Cards from Library Images</button><div>'
        + '<div style="color: #888888"><select id="myDeckList"></select> : Deck<div>'
        + '<div style="color: #888888"><select id="myFolderList"></select> : Folder<div>'
        + '<div style="color: #888888"><input type="text" name="lname" id="myImageRegExpInput" value=".*"> : Image RegExp<div>'
    ;
    zNode.setAttribute ('id', 'myContainer');
    zNode.style.position = "absolute";
    zNode.style.zIndex = 10;
    zNode.style.left = "50px";
    document.body.appendChild (zNode);

    //--- Activate the newly added button.
    deckButton = document.getElementById ("myDeckButton");
    deckButton.addEventListener (
        "click", ButtonClickAction, false
    );

    // --- Populate list with available decks
    deckList = document.getElementById ("myDeckList");
    for (var i = 0 ; i < Campaign.decks.backboneFirebase.collection.models.length ; i++) {
        var option = document.createElement("option");
        option.text = i.toString() + " : " + Campaign.decks.backboneFirebase.collection.models[i].attributes.name;
        option.value = i;
        deckList.add(option);
    }


    folderList = document.getElementById ("myFolderList");
    var root = loadJSON(linkToRoot)
    var folders = loadFolders(linkToRoot, "")

    var rootOption = document.createElement("option");
    rootOption.text = "/";
    rootOption.value = "";
    var recentOption = document.createElement("option");
    recentOption.text = "Uncategorized";
    recentOption.value = "-1";

    folderList.add(recentOption);
    folderList.add(rootOption);
    for (var j = 0; j < folders.length; j++) {
        var option2 = document.createElement("option");
        option2.text = folders[j].name;
        option2.value = folders[j].value;
        folderList.add(option2);
    }

    imageRegExpInput = document.getElementById ("myImageRegExpInput");
}

function loadFolders(root, prefix) {
    var folders = [];
    var resp = loadJSON(root);
    for (var i = 0; i < resp.length; i++) {
        var item = resp[i];
        if (item.t === "folder") {
            var path = prefix+"/"+item.n;
            var folder = {name: path, value: item.id}
            folders.push(folder);
            folders = folders.concat(loadFolders(linkToFolder+item.id, path));
        }
    }
    return folders;
}

// setting the button in 10 sec after start so not ot interfare with roll20 initialization
setTimeout(addButton, 10000);