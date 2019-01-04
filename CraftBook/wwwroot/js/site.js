/*AJAX запрос на address
function Request(address) {
    this.__proto__ = new XMLHttpRequest();
    open("POST", address, true);
    setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
}*/
function Inventory() {
    var inputNameIngr = document.querySelector("article.inventory input[type=\"text\"]");
    var inputCountIngr = document.querySelector("article.inventory input[type=\"number\"]");
    var inputUIIngr = document.querySelector("article.inventory input[name=\"ingredient_unit\"]");
    var form = document.querySelector("article.inventory form.create-ingredient");
    var listIngridients = document.querySelector("article.inventory form.list-ingredients");
    //Подсказки при вводе
    inputNameIngr.addEventListener("input", function () {
        var nameChip = inputNameIngr.value;
        console.log(nameChip);
        if (nameChip.length === 0)
            return;
        var requestSearch = new XMLHttpRequest();
        requestSearch.open("POST", "/Ingredients/Index", true);
        requestSearch.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        requestSearch.onloadend = function () {
            if (requestSearch.status === 404)
                return;
            var tmp = document.querySelector("datalist[id=\"ingredients\"");
            if (tmp != null)
                tmp.parentNode.removeChild(tmp);
            form.insertAdjacentHTML("afterend", requestSearch.response);
        };
        requestSearch.send("nameChip=" + encodeURIComponent(nameChip));
    });
    //Окончание ввода названия ингредиента - устанавливаем единицы измерения
    inputNameIngr.addEventListener("change", function () {
        var nameChip = inputNameIngr.value;
        var tmp = document.querySelector("option[value=\"" + nameChip + "\"");
        if (tmp == null)
            return;
        inputUIIngr.setAttribute("value", tmp.getAttribute("label"));
    });
    var requestAdd = new XMLHttpRequest();
    function addIngredient() {
        requestAdd.open("POST", "/IngredientQuant/FindName", true);
        requestAdd.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        requestAdd.onloadend = function () {
            //todo нормально как-то
            if (requestAdd.status === 404) {
                alert('ингредиент не найден!');
                return;
            }
            listIngridients.insertAdjacentHTML("beforeend", requestAdd.response);
            var fieldform = form.lastChild;
            console.log(fieldform);
            fieldform.lastChild.onkeyup = function () {
                form.removeChild(fieldform);
                return false;
            };
            inputCountIngr.setAttribute("value", null);
            inputNameIngr.setAttribute("value", null);
            inputUIIngr.setAttribute("value", null);
        };
        requestAdd.send("ingredientName=" + encodeURIComponent(inputNameIngr.value) + "&volume=" + encodeURIComponent(inputCountIngr.value));
        return false;
    }
    form.onsubmit = addIngredient;
}
var inventory = new Inventory();
