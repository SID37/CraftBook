/*AJAX запрос на address
function Request(address) {
    this.__proto__ = new XMLHttpRequest();
    open("POST", address, true);
    setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
}*/
var Inventory = /** @class */ (function () {
    function Inventory() {
        var _this = this;
        this.inputNameIngr = document.querySelector("article.inventory input[type=\"text\"]");
        this.inputButton = document.getElementById("buttonAddIngridient");
        this.inputCountIngr = document.querySelector("article.inventory input[type=\"number\"]");
        this.inputUIIngr =
            document.querySelector("article.inventory input[name=\"ingredient_unit\"]");
        this.form = document.querySelector("article.inventory form.create-ingredient");
        this.listIngridients = (document.querySelector("article.inventory form.list-ingredients"));
        //Подсказки при вводе
        this.inputNameIngr.addEventListener("input", function () {
            var nameChip = _this.inputNameIngr.value;
            console.log(nameChip);
            if (nameChip.length === 0)
                return;
            if (document.querySelector("option[value=\"" + nameChip + "\""))
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
                _this.form.insertAdjacentHTML("afterend", requestSearch.response);
            };
            requestSearch.send("nameChip=" + encodeURIComponent(nameChip));
        });
        //Окончание ввода названия ингредиента - устанавливаем единицы измерения
        this.inputNameIngr.addEventListener("change", function () {
            var nameChip = _this.inputNameIngr.value;
            var tmp = document.querySelector("option[value=\"" + nameChip + "\"");
            if (tmp == null) {
                _this.inputUIIngr.value = null;
                _this.inputButton.style.visibility = "hidden";
            }
            else {
                _this.inputUIIngr.value = tmp.getAttribute("label");
                _this.inputButton.style.visibility = "visible";
            }
        });
        this.form.onsubmit = function (event) {
            try {
                if (_this.inputUIIngr.value === "") {
                    return false;
                }
                var requestAdd = new XMLHttpRequest();
                requestAdd.open("POST", "/IngredientQuant/FindName", true);
                requestAdd.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                requestAdd.onloadend = function () {
                    //todo нормально как-то
                    if (requestAdd.status === 404) {
                        alert('ингредиент не найден!');
                        return;
                    }
                    _this.listIngridients.insertAdjacentHTML("beforeend", requestAdd.response);
                    var fieldform = _this.listIngridients.lastChild;
                    fieldform.querySelector("input[type=\"image\"").onclick = function () {
                        fieldform.remove();
                        return false;
                    };
                    _this.inputCountIngr.value = null;
                    _this.inputNameIngr.value = null;
                    _this.inputUIIngr.value = null;
                };
                var name_1 = _this.inputNameIngr.value;
                var count = _this.inputCountIngr.value;
                requestAdd.send("ingredientName=" +
                    encodeURIComponent(name_1) +
                    "&volume=" +
                    encodeURIComponent(count));
            }
            catch (e) {
                console.log(e.toString());
                return false;
            }
            return false;
        };
    }
    return Inventory;
}());
var inventory = new Inventory();
