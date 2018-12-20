// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function createIngredient(name, count) {
    var ing = document.createElement('li');
    ing.appendChild(document.createElement('fieldset'));
    ing = ing.firstChild;
    const fname = document.createElement('output');
    const fcount = document.createElement('output');
    fname.appendChild(document.createTextNode(name));
    fcount.appendChild(document.createTextNode(count));
    ing.appendChild(fname);
    ing.appendChild(fcount);
    return ing;
}
function Inventory() {
    inputNameIngr = document.querySelector("article.inventory input[type=\"text\"]");
    inputCountIngr = document.querySelector("article.inventory input[type=\"number\"]");
    buttonAddIngridient = document.querySelector("article.inventory input[type=\"button\"]");
    listIngridients = document.querySelector("article.inventory ul");
    function addIngredient() {
        listIngridients.appendChild(createIngredient(inputNameIngr.value, inputCountIngr.value));
        inputCountIngr.value = null;
        inputNameIngr.value = null;
    }
    buttonAddIngridient.onclick = addIngredient;
}
var inventory = new Inventory();