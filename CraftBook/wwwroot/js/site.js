// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.


function Inventory() {
    inputNameIngr = document.querySelector("article.inventory input[type=\"text\"]");
    inputCountIngr = document.querySelector("article.inventory input[type=\"number\"]");
    inputUIIngr = document.querySelector("article.inventory input[name=\"ingredient_unit\"]");
    form = document.querySelector("article.inventory form.create-ingredient");
    listIngridients = document.querySelector("article.inventory form.list-ingredients");

    inputNameIngr.oninput = function () {
        var nameChip = inputNameIngr.value;
        console.log(nameChip);
        if (nameChip.length === 0)
            return;
        var requestSearch = new XMLHttpRequest();
        requestSearch.open("POST", "/Ingredients/Index", true);
        requestSearch.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        requestSearch.onloadend = function() {
            if (requestSearch.status === 404)
                return;
            var tmp = document.querySelector("datalist[id=\"ingredients\"");
            if(tmp!=null)
                tmp.parentNode.removeChild(tmp);
            form.insertAdjacentHTML("afterend", requestSearch.response);
        }
        requestSearch.send("nameChip=" + encodeURIComponent(nameChip));
    }

    inputNameIngr.onchange = function() {
        var nameChip = inputNameIngr.value;
        var tmp = document.querySelector("option[value=\"" + nameChip + "\"");
        inputUIIngr.setAttribute("value", tmp.getAttribute("label"));
    }

    RequestAdd = new XMLHttpRequest();
    function addIngredient() {
        RequestAdd.open("POST", "/IngredientQuant/FindName", true);
        RequestAdd.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        RequestAdd.onloadend = function (event) {
            //todo нормально как-то
            if (RequestAdd.status === 404) {
                alert('ингредиент не найден!');
                return;
            }
            listIngridients.insertAdjacentHTML("beforeend", RequestAdd.response);
            inputCountIngr.value = null;
            inputNameIngr.value = null;
        };
        RequestAdd.send("ingredientName=" + encodeURIComponent(inputNameIngr.value) + "&volume=" +encodeURIComponent(inputCountIngr.value));
        return false;
    }
    form.onsubmit = addIngredient;
}

var inventory = new Inventory();

