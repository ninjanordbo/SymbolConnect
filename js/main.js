////// main interface button functionality
const searchButton = document.querySelector('#searchButton');
searchButton.addEventListener('click', function(){
  const keyword = document.querySelector('input').value;
  getFetchSearch(keyword);
});

const savedButton = document.querySelector('.savedButton');
savedButton.addEventListener('click', getFetchSaved);

const quickSearchButtons = document.querySelectorAll('.quickSearchButton');
function addQuickSearchButtonEventListeners(){
  for (const button of quickSearchButtons) {
    button.addEventListener('click', function(){
    const keyword = this.innerText;
    getFetchSearch(keyword);
    })
  }
}
addQuickSearchButtonEventListeners();
////

////// local storage functionality
function saveCardIdToLocalStorage(id){
    const existingEntries = JSON.parse(localStorage.getItem("cardImageIds")) || [];
    if( !existingEntries.includes(id)){
      existingEntries.push(id);
      localStorage.setItem("cardImageIds", JSON.stringify(existingEntries));
    }
}

function removeCardIdFromLocalStorage(id){
  const existingEntries = JSON.parse(localStorage.getItem("cardImageIds")) || [];
  const indexOfCard = existingEntries.indexOf(id);
  if(indexOfCard > -1){
    existingEntries.splice(indexOfCard, 1);
    localStorage.setItem("cardImageIds", JSON.stringify(existingEntries));
    getFetchSaved();
  }
}
////


////// fetch logic and functionality
let fetchingSavedBool = false;
function getFetchSearch(keyword){
  const url = `https://api.arasaac.org/api/pictograms/en/search/${keyword}`;

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        fetchingSavedBool = false;
        const searchSection = document.querySelector('.cardSection');
        removeAllChildNodes(searchSection);
        for(let i = 0; i < data.length; i++){
            let item = new Cards(data[i]);
            item.createCard(i);
        }
        selectAllSaveButtons();
        addSaveButtonEventListeners();
      })
      .catch(err => {
          console.log(`error ${err}`);
      });
}


function getFetchSaved(){
  const existingEntries = JSON.parse(localStorage.getItem("cardImageIds")) || [];
  const searchSection = document.querySelector('.cardSection');
  removeAllChildNodes(searchSection);
  if(existingEntries[0]){
    for(let entry of existingEntries){
      const url = `https://api.arasaac.org/api/pictograms/en/${entry}`;

      fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          fetchingSavedBool = true;
          let item = new Cards(data);
          item.createCard(entry);
          selectAllEraseButtons();
          addEraseButtonEventListeners();
        })
        .catch(err => {
            console.log(`error ${err}`);
        });
    }
  }
  else{
    alert(`You have no cards saved.`);
  }
}
////

////// card class, constructor, and functionality
class Cards{
  constructor(info){
    this.name = info.keywords[0].keyword;
    this.imageId = info._id;
    this.image = `https://static.arasaac.org/pictograms/${this.imageId}/${this.imageId}_500.png`;
  }

  createCard(i){

    let cardDiv = document.createElement('div');
    cardDiv.classList.add(`cardDiv`, `card${i}`);
    document.querySelector(`.cardSection`).appendChild(cardDiv);
    
    let cardImg = document.createElement('img');
    cardImg.classList.add('cardImg');
    cardImg.src = this.image;
    document.querySelector(`.card${i}`).appendChild(cardImg);

    let cardNameH3 = document.createElement('h3');
    cardNameH3.classList.add('cardName');
    cardNameH3.innerText = this.name;
    document.querySelector(`.card${i}`).appendChild(cardNameH3);

    if(fetchingSavedBool){
      let eraseButton = document.createElement('button');
      eraseButton.classList.add('cardButton', 'eraseButton');
      eraseButton.id = this.imageId;
      eraseButton.innerText = `Delete`;
      document.querySelector(`.card${i}`).appendChild(eraseButton);
    }
    else{
      let saveButton = document.createElement('button');
      saveButton.classList.add('cardButton', 'saveButton');
      saveButton.id = this.imageId;
      saveButton.innerText = `Save`;
      document.querySelector(`.card${i}`).appendChild(saveButton);
    }
  }
}

// additional card functionality
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
//

// card button functionality
let saveButtons
function selectAllSaveButtons(){
  saveButtons = document.querySelectorAll('.saveButton');
}
function addSaveButtonEventListeners(){
  for (const button of saveButtons) {
    button.addEventListener('click', function(){
      saveCardIdToLocalStorage(this.id);
    })
  }
}

let eraseButtons
function selectAllEraseButtons(){
  eraseButtons = document.querySelectorAll('.eraseButton');
}
function addEraseButtonEventListeners(){
    for (const button of eraseButtons) {
      button.addEventListener('click', function(){
        removeCardIdFromLocalStorage(this.id);
      })
    }
  }
////

////// menu functionality
function toggleCssMenu(icon) {
    var cssmenu = document.getElementById('cssmenu');
    if (icon.className.indexOf('active') == -1) {
        icon.className = 'menu-icon active';
	cssmenu.style.display = "block";
	setTimeout(function(){cssmenu.className = 'active';},0);            
    }
    else {
        icon.className = 'menu-icon';
	cssmenu.className = '';
	setTimeout(function(){cssmenu.style.display = "none";},411); 
    }
}
////