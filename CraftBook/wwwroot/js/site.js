var IngredientSoul = /** @class */ (function () {
    function IngredientSoul() {
    }
    return IngredientSoul;
}());
var IngredientView = /** @class */ (function () {
    function IngredientView(soul) {
        var _this = this;
        this.main = document.createElement("div");
        this.main.classList.add("fieldform");
        this.main.innerHTML = '<div class="in-frame">' +
            '<input type="text" name="name" readonly />' +
            '<input type="number" name="volume" readonly />' +
            '<input type="text" name="unit" readonly />' +
            '</div>' +
            '<input type="image" name="del_ingredient" src="/images/close.svg" />';
        this.button = this.main.querySelector("input[type=\"image\"");
        this.button.onclick = function () {
            _this.main.remove();
            _this.ondeleted(_this);
            return false;
        };
        this.name = this.main.querySelector('input[name="name"]');
        this.unit = this.main.querySelector('input[name="unit"]');
        this.volume = this.main.querySelector('input[name="volume"]');
        this.name.value = soul.name;
        this.volume.value = soul.quantity.toString();
        this.unit.value = soul.unitShortName;
    }
    return IngredientView;
}());
//Отвечает за список ингредиентов в инвентаре
var ListIngredients = /** @class */ (function () {
    function ListIngredients(node) {
        var _this = this;
        this.key = "listIngredient";
        this.addIngredient = function (data) {
            var soul = JSON.parse(data);
            //на случай, если добавляемый ингредиент уже есть
            var find = _this.models.filter(function (model) { return model.id === soul.id; });
            if (find != null && find.length !== 0) {
                var j = _this.models.lastIndexOf(find[0]);
                _this.views[j].button.onclick(null);
            }
            var index = _this.models.length;
            _this.models[index] = soul;
            _this.addView()(_this.models[index], index, _this.models);
        };
        this.headNode = node;
        this.models = JSON.parse(localStorage.getItem(this.key));
        this.views = new Array();
        if (this.models == null)
            this.models = new Array();
        else
            this.models.forEach(this.addView());
        window.addEventListener("unload", function () { localStorage.setItem(_this.key, JSON.stringify(_this.models)); });
        this.headNode.onsubmit = function () {
            _this.onshearch(_this.models);
            return false;
        };
    }
    ListIngredients.prototype.addView = function () {
        var _this = this;
        return function (soul, i) {
            _this.views[i] = new IngredientView(soul);
            _this.views[i].ondeleted = function (view) {
                var j = _this.views.lastIndexOf(view);
                _this.models.splice(j, 1);
                _this.views.splice(j, 1);
            };
            _this.headNode.appendChild(_this.views[i].main);
        };
    };
    return ListIngredients;
}());
var ListRecipes = /** @class */ (function () {
    function ListRecipes(node) {
        this.headNode = node;
    }
    ListRecipes.prototype.search = function (list) {
        var _this = this;
        var requestSearch = new XMLHttpRequest();
        requestSearch.open("POST", "/Recipes/SearchByIngredients", true);
        requestSearch.setRequestHeader("Content-Type", "application/json");
        requestSearch.onloadend = function () {
            if (requestSearch.status === 404)
                return;
            while (_this.headNode.hasChildNodes())
                _this.headNode.removeChild(_this.headNode.firstChild);
            _this.headNode.insertAdjacentHTML("beforeend", requestSearch.response);
        };
        var message = {
            ingredients: list,
            pageNumber: 1
        };
        requestSearch.send(JSON.stringify(message));
        var ingredients = "";
        var istr = "ingredients";
        for (var i = 0; i < list.length; ++i) {
            var soul = list[i];
            for (var item in soul) {
                if (soul.hasOwnProperty(item)) {
                    ingredients += istr + ("[" + i + "].") + item + "=" + soul[item] + "&";
                }
            }
        }
    };
    ;
    return ListRecipes;
}());
var Inventory = /** @class */ (function () {
    function Inventory() {
        var _this = this;
        this.inputNameIngr = document.querySelector("article.inventory input[type=\"text\"]");
        this.inputButton = document.getElementById("buttonAddIngridient");
        this.inputCountIngr = document.querySelector("article.inventory input[type=\"number\"]");
        this.inputUIIngr =
            document.querySelector("article.inventory input[name=\"ingredient_unit\"]");
        this.form = document.querySelector("article.inventory form.add-ingredient");
        this.listIngridients = new ListIngredients((document.querySelector("article.inventory form.list-ingredients")));
        this.listRecipes = new ListRecipes(document.querySelector('article.recipe_list'));
        this.listIngridients.onshearch = function (list) {
            _this.listRecipes.search(list);
        };
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
        //Добавление ингредиента в список
        this.form.onsubmit = function (event) {
            try {
                if (_this.inputUIIngr.value === "") {
                    return false;
                }
                var requestAdd_1 = new XMLHttpRequest();
                requestAdd_1.open("POST", "/IngredientQuant/FindName", true);
                requestAdd_1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                requestAdd_1.onloadend = function () {
                    //todo нормально как-то
                    if (requestAdd_1.status === 404) {
                        alert('ингредиент не найден!');
                        return;
                    }
                    _this.listIngridients.addIngredient(requestAdd_1.response);
                    _this.inputCountIngr.value = null;
                    _this.inputNameIngr.value = null;
                    _this.inputUIIngr.value = null;
                };
                var name_1 = _this.inputNameIngr.value;
                var count = _this.inputCountIngr.value;
                requestAdd_1.send("ingredientName=" + encodeURIComponent(name_1) + "&volume=" + encodeURIComponent(count));
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
