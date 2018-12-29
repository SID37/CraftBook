// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

function createIngredient(name, count) {
    var ing = document.createElement('div');
    ing.setAttribute('class', 'fieldform')
    ing.appendChild(document.createElement('div'));
    ing = ing.firstChild;
    ing.setAttribute('class', 'in-frame');
    const fname = document.createElement('input');
    fname.setAttribute('type', 'text');
    const fcount = document.createElement('input');
    fcount.setAttribute('type', 'number');
    fname.setAttribute('value',name);
    fcount.setAttribute('value', count);
    ing.appendChild(fname);
    ing.appendChild(fcount);
    return ing;
}
function Inventory() {
    xhr = new XMLHttpRequest();
    inputNameIngr = document.querySelector("article.inventory input[type=\"text\"]");
    inputCountIngr = document.querySelector("article.inventory input[type=\"number\"]");
    form = document.querySelector("article.inventory form.create-ingredient");
    listIngridients = document.querySelector("article.inventory form.list-ingredients");
    function addIngredient() {
        xhr.open("POST", "IngredientQuant/FindName", true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onloadend = function (event) {
            //todo нормально как-то
            if (xhr.status === 404) {
                alert('ингредиент не найден!');
                return;
            }
            listIngridients.insertAdjacentHTML("beforeend", xhr.response);
            inputCountIngr.value = null;
            inputNameIngr.value = null;
        };
        xhr.send("ingredientName=" + encodeURIComponent(inputNameIngr.value) + "&volume=" +encodeURIComponent(inputCountIngr.value));
        return false;
    }
    form.onsubmit = addIngredient;
}

var inventory = new Inventory();

