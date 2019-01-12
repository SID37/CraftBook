var IngredientSoul = /** @class */ (function () {
    function IngredientSoul() {
    }
    return IngredientSoul;
}());
var IngredientView = /** @class */ (function () {
    function IngredientView(soul) {
        var _this = this;
        this["delete"] = function () {
            _this.button.onclick(null);
        };
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
                _this.views[j]["delete"]();
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
var SearchString = /** @class */ (function () {
    function SearchString() {
        var _this = this;
        this.form = document.querySelector('form[action="/Recipes/SearchByString"');
        this.data = this.form.querySelector('input[name="searchString"]');
        this.form.onsubmit = function () {
            var str = _this.data.value;
            if (str)
                _this.onshearch(str);
            return false;
        };
    }
    return SearchString;
}());
var ListRecipesButton = /** @class */ (function () {
    function ListRecipesButton(element) {
        var _this = this;
        this.btn = element;
        if (this.btn.id !== "currentPage") {
            this.btn.onclick = function (ev) {
                _this.onclick(parseInt(_this.btn.textContent));
            };
        }
    }
    return ListRecipesButton;
}());
var ListRecipes = /** @class */ (function () {
    function ListRecipes(node) {
        this.headNode = node;
    }
    ListRecipes.prototype.search = function (a, page) {
        var _this = this;
        if (page === void 0) { page = 1; }
        var requestSearch = new XMLHttpRequest();
        requestSearch.onloadend = function () {
            if (requestSearch.status === 404)
                return;
            while (_this.headNode.hasChildNodes())
                _this.headNode.removeChild(_this.headNode.firstChild);
            _this.headNode.insertAdjacentHTML("beforeend", requestSearch.response);
            _this.headNode.querySelectorAll(".page").forEach(function (btn) {
                new ListRecipesButton(btn).onclick = function (page) {
                    _this.search(a, page);
                };
            });
        };
        if (typeof (a) == "string") {
            var str = a;
            requestSearch.open("POST", "/Recipes/SearchByString", true);
            requestSearch.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            requestSearch.send("searchString=" + encodeURIComponent(str) + "&pageNumber=" + page);
        }
        else if (typeof (a) == "object") {
            var list = a;
            requestSearch.open("POST", "/Recipes/SearchByIngredients", true);
            requestSearch.setRequestHeader("Content-Type", "application/json");
            var message = {
                ingredients: list,
                pageNumber: page
            };
            requestSearch.send(JSON.stringify(message));
        }
    };
    ;
    return ListRecipes;
}());
var IngredientAddatorView = /** @class */ (function () {
    function IngredientAddatorView() {
        var _this = this;
        this.name = document.querySelector("article.inventory input[type=\"text\"]");
        this.btnAdd = document.getElementById("buttonAddIngridient");
        this.count = document.querySelector("article.inventory input[type=\"number\"]");
        this.unit =
            document.querySelector("article.inventory input[name=\"ingredient_unit\"]");
        this.form = document.querySelector("article.inventory form.add-ingredient");
        //Подсказки при вводе
        this.name.addEventListener("input", function () {
            var nameChip = _this.name.value;
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
        this.name.addEventListener("change", function () {
            var nameChip = _this.name.value;
            var tmp = document.querySelector("option[value=\"" + nameChip + "\"");
            if (tmp == null) {
                _this.unit.value = null;
                _this.btnAdd.style.visibility = "hidden";
            }
            else {
                _this.unit.value = tmp.getAttribute("label");
                _this.btnAdd.style.visibility = "visible";
            }
        });
        //Добавление ингредиента в список
        this.form.onsubmit = function (event) {
            try {
                if (_this.unit.value === "") {
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
                    _this.onadded(requestAdd_1.response);
                    _this.count.value = null;
                    _this.name.value = null;
                    _this.unit.value = null;
                };
                var name_1 = _this.name.value;
                var count = _this.count.value;
                requestAdd_1.send("ingredientName=" + encodeURIComponent(name_1) + "&volume=" + encodeURIComponent(count));
            }
            catch (e) {
                console.log(e.toString());
                return false;
            }
            return false;
        };
    }
    return IngredientAddatorView;
}());
var Inventory = /** @class */ (function () {
    function Inventory() {
        var _this = this;
        this.addator = new IngredientAddatorView();
        this.listIngridients =
            new ListIngredients((document.querySelector("article.inventory form.list-ingredients")));
        this.listRecipes = new ListRecipes(document.querySelector('article.recipe_list'));
        this.listIngridients.onshearch = function (list) {
            _this.listRecipes.search(list);
        };
        var ss = new SearchString;
        ss.onshearch = function (str) { _this.listRecipes.search(str); };
        this.addator.onadded = this.listIngridients.addIngredient;
    }
    return Inventory;
}());
var inventory = new Inventory();
