var IngredientModel = /** @class */ (function () {
    function IngredientModel() {
    }
    return IngredientModel;
}());
var IngredientView = /** @class */ (function () {
    function IngredientView(soul) {
        var _this = this;
        this.delete = function () {
            _this.button.onclick(null);
        };
        this.main = document.createElement("div");
        this.main.classList.add("fieldform");
        this.main.innerHTML = //'<div class="fieldform">' +
            '<span class="name"></span>' +
                '<span class="volume"></span>' +
                //'<input type="text" name="unit" readonly />' +
                //'</div>' +
                '<input type="image" name="del_ingredient" src="/images/ingredient/close.svg" />';
        this.button = this.main.querySelector("input[type=\"image\"");
        this.button.onclick = function () {
            _this.main.remove();
            _this.ondeleted(_this);
            return false;
        };
        this.name = this.main.querySelector('span[class="name"]');
        //this.unit = this.main.querySelector('input[name="unit"]') as HTMLInputElement;
        this.volume = this.main.querySelector('span[class="volume"]');
        this.name.textContent = soul.name;
        this.volume.textContent = soul.quantity + " " + soul.unitShortName;
        //this.unit.value = soul.unitShortName;
    }
    return IngredientView;
}());
//Отвечает за список ингредиентов в инвентаре
var ListIngredients = /** @class */ (function () {
    function ListIngredients(node, temporary, name) {
        if (temporary === void 0) { temporary = false; }
        if (name === void 0) { name = "listIngredient"; }
        var _this = this;
        //Лямбдой - чтоб можно было передавать как callback и this не теряла контекст
        this.addIngredient = function (model) {
            //на случай, если добавляемый ингредиент уже есть
            var find = _this.models.filter(function (model_) { return model_.id === model.id; });
            if (find != null && find.length !== 0) {
                var j = _this.models.lastIndexOf(find[0]);
                _this.views[j].delete();
            }
            var index = _this.models.length;
            _this.models[index] = model;
            _this.addView()(_this.models[index], index, _this.models);
        };
        this.headNode = node;
        this.storage = temporary ? sessionStorage : localStorage;
        this.key = name;
        this.views = new Array();
        this.models = JSON.parse(this.storage.getItem(this.key));
        if (this.models == null)
            this.models = new Array();
        else
            this.models.forEach(this.addView());
        window.addEventListener("unload", function () { _this.storage.setItem(_this.key, JSON.stringify(_this.models)); });
        this.headNode.onsubmit = function () {
            return false;
        };
    }
    ListIngredients.prototype.getIngredients = function () {
        return this.models;
    };
    //Лямбдой - чтоб можно было передавать как callback и this не теряла контекст
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
var IngredientAddatorView = /** @class */ (function () {
    function IngredientAddatorView() {
        var _this = this;
        this.name = document.querySelector("article.inventory input[type=\"text\"]");
        this.btnAdd = document.getElementById("buttonAddIngridient");
        this.count = document.querySelector("article.inventory input[type=\"number\"]");
        this.unit =
            document.querySelector("article.inventory input[name=\"ingredient_unit\"]");
        this.form = document.querySelector("article.inventory form.add-ingredient");
        this.error = new ErrorView(this.form);
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
            }
            else {
                _this.unit.value = tmp.getAttribute("label");
            }
        });
        //Запрашиваем у сервера корректность ингредиента
        this.form.onsubmit = function (event) {
            _this.name.setCustomValidity("");
            //заглушение исключений ради того, чтобы страничка не обновлялась при сбое скрипта
            try {
                if (_this.unit.value === "") {
                    _this.error.display("Такого ингредиента не существует");
                    return false;
                }
                _this.error.display(false);
                var requestAdd_1 = new XMLHttpRequest();
                requestAdd_1.open("POST", "/IngredientQuant/FindName", true);
                requestAdd_1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                requestAdd_1.onloadend = function () {
                    var response = JSON.parse(requestAdd_1.response);
                    if (response.message != null) {
                        _this.error.display(response.message);
                        return;
                    }
                    _this.onadded(response);
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
    function Inventory(temporary) {
        if (temporary === void 0) { temporary = false; }
        this.addator = new IngredientAddatorView();
        this.listIngridients =
            new ListIngredients((document.querySelector("article.inventory form.list-ingredients")), temporary);
        this.addator.onadded = this.listIngridients.addIngredient;
    }
    Inventory.prototype.getIngredients = function () {
        return this.listIngridients.getIngredients();
    };
    return Inventory;
}());
