var ErrorView = /** @class */ (function () {
    function ErrorView(node) {
        this.parent = node;
        this.view = document.createElement("div");
        this.view.classList.add("error");
        node.insertAdjacentElement("beforebegin", this.view);
        this.display(false);
    }
    ErrorView.prototype.display = function (message) {
        if (message) {
            if (typeof message == "string")
                this.view.textContent = message;
            this.view.style.display = "initial";
        }
        else
            this.view.style.display = "none";
    };
    return ErrorView;
}());

var ImageUploader = /** @class */ (function () {
    function ImageUploader(node, uploaded, mod) {
        if (mod === void 0) { mod = "one"; }
        var error = new ErrorView(node);
        node.ondrop = function (ev) {
            var data = ev.dataTransfer;
            if (data) {
                if (data.files.length > 0) {
                    ev.preventDefault();
                    if (data.files.length > 1 && mod === "one") {
                        error.display("Здесь можно загрузить только один файл!");
                        return;
                    }
                }
                console.group("files");
                var _loop_1 = function (i) {
                    var file = data.files[i];
                    if (file.type.match(/image/)) {
                        var uploadRequest_1 = new XMLHttpRequest();
                        console.log("\u041E\u0442\u043B\u043E\u0432\u0438\u043B\u0438 \u0444\u0430\u0439\u043B " + file.name);
                        uploadRequest_1.onloadend = function () {
                            error.display(false);
                            if (uploadRequest_1.status > 300) {
                                //TODO как-то сообщить пользователю
                                error.display("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0443. \u041E\u0448\u0438\u0431\u043A\u0430 " + uploadRequest_1.status + ".");
                                return;
                            }
                            var message = JSON.parse(uploadRequest_1.response);
                            if (message.message) {
                                error.display(message.message);
                                return;
                            }
                            uploaded(message.link);
                        };
                        uploadRequest_1.open("POST", "/Images/Create", true);
                        var formData = new FormData();
                        formData.append("image", file);
                        uploadRequest_1.send(formData);
                    }
                };
                for (var i = 0; i < data.files.length; i++) {
                    _loop_1(i);
                }
                console.groupEnd();
            }
        };
    }
    return ImageUploader;
}());
var ImageView = /** @class */ (function () {
    function ImageView(imgNode, link) {
        this.img = imgNode;
        if (link)
            this.setLink(link);
    }
    ImageView.prototype.setLink = function (link) {
        this.img.src = link;
    };
    return ImageView;
}());

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
    ListRecipes.prototype.setList = function (html, searcher) {
        while (this.headNode.hasChildNodes())
            this.headNode.removeChild(this.headNode.firstChild);
        this.headNode.insertAdjacentHTML("beforeend", html);
        this.headNode.querySelectorAll(".page").forEach(function (btn) {
            new ListRecipesButton(btn).onclick = function (page) {
                searcher.search(page);
            };
        });
        this.headNode.querySelectorAll("img").forEach(function (img) {
            img.addEventListener("error", function () {
                img.src = "/images/default.png";
            });
        });
    };
    return ListRecipes;
}());

var TimeRecipeModel = /** @class */ (function () {
    function TimeRecipeModel(days, hours, minutes) {
        this.days = days;
        this.hours = hours;
        this.minutes = minutes;
    }
    return TimeRecipeModel;
}());
var TimeRecipeView = /** @class */ (function () {
    function TimeRecipeView(node) {
        this.days = node.querySelector('[name="days"]');
        this.hours = node.querySelector('[name="hours"]');
        this.minutes = node.querySelector('[name="minutes"]');
    }
    TimeRecipeView.prototype.getTime = function () {
        return new TimeRecipeModel(this.days.valueAsNumber, this.hours.valueAsNumber, this.minutes.valueAsNumber);
    };
    return TimeRecipeView;
}());
var RecipeModel = /** @class */ (function () {
    function RecipeModel() {
    }
    return RecipeModel;
}());
var RecipeCreateView = /** @class */ (function () {
    function RecipeCreateView(form, inventory, listener) {
        var _this = this;
        this.name = document.getElementById("Name");
        this.description = document.getElementById("Description");
        this.instruction = document.getElementById("Instruction");
        this.image = document.getElementById("Image");
        var img = new ImageView(document.getElementById("ImageOut"));
        this.error = new ErrorView(form);
        this.image.addEventListener("change", function (ev) {
            img.setLink(_this.image.value);
        });
        var uploader = new ImageUploader(this.image, function (link) {
            _this.image.value = link;
            img.setLink(link);
        });
        this.cookingTime = new TimeRecipeView(form.querySelector('[name="time"]'));
        this.ingredients = inventory;
        form.onsubmit = function () {
            try {
                var recipe = new RecipeModel();
                for (var field in _this) {
                    if (field == "ingredients") {
                        recipe.ingredients = _this.ingredients.getIngredients();
                        console.debug(_this.ingredients.getIngredients());
                    }
                    else if (field == "cookingTime") {
                        recipe.cookingTime = _this.cookingTime.getTime();
                    }
                    else if (field != "error" && field != "setError") {
                        recipe[field.toString()] = _this[field.toString()].value;
                    }
                }
                listener(recipe);
            }
            catch (err) {
                console.log(err);
            }
            return false;
        };
    }
    RecipeCreateView.prototype.setError = function (message) {
        this.error.display(message);
    };
    return RecipeCreateView;
}());

var SearcherByStringView = /** @class */ (function () {
    function SearcherByStringView(form) {
        var _this = this;
        this.form = form;
        this.data = this.form.querySelector('input[name="searchString"]');
        this.form.onsubmit = function () {
            var str = _this.data.value;
            if (str) {
                var searcher = new SearcherByString(str);
                _this.onsearch(searcher);
            }
            return false;
        };
    }
    return SearcherByStringView;
}());
var SearcherByString = /** @class */ (function () {
    function SearcherByString(request) {
        this.request = request.slice();
    }
    SearcherByString.prototype.search = function (input) {
        var _this = this;
        if (typeof (input) == "number") {
            var page = input;
            var requestSearch_1 = new XMLHttpRequest();
            requestSearch_1.onloadend = function () {
                if (requestSearch_1.status === 404) {
                    //TODO как-то сообщить пользователю
                    console.log("\u041F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \"" + _this.request + "\" \u043E\u0442\u0432\u0435\u0442: 404");
                    return;
                }
                _this.onsearched(requestSearch_1.response, _this);
            };
            requestSearch_1.open("POST", "/Recipes/SearchByString", true);
            requestSearch_1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            requestSearch_1.send("searchString=" + encodeURIComponent(this.request) + "&pageNumber=" + page);
        }
        else {
            this.onsearched = input;
            this.search(1);
        }
    };
    return SearcherByString;
}());
var SearchByIngredientsView = /** @class */ (function () {
    function SearchByIngredientsView(button, sourse) {
        var _this = this;
        this.button = button;
        this.data = sourse;
        this.button.onclick = function () {
            var ingredients = _this.data.getIngredients();
            if (ingredients) {
                var searcher = new SearcherByIngredients(ingredients);
                _this.onsearch(searcher);
            }
            return false;
        };
    }
    return SearchByIngredientsView;
}());
var SearcherByIngredients = /** @class */ (function () {
    function SearcherByIngredients(request) {
        this.request = request.slice();
    }
    SearcherByIngredients.prototype.search = function (input) {
        var _this = this;
        if (typeof (input) == "number") {
            var page = input;
            var requestSearch_2 = new XMLHttpRequest();
            requestSearch_2.onloadend = function () {
                if (requestSearch_2.status === 404) {
                    //TODO как-то сообщить пользователю
                    console.log("\u041F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \"" + _this.request + "\" \u043E\u0442\u0432\u0435\u0442: 404");
                    return;
                }
                _this.onsearched(requestSearch_2.response, _this);
            };
            requestSearch_2.open("POST", "/Recipes/SearchByIngredients", true);
            requestSearch_2.setRequestHeader("Content-Type", "application/json");
            var message = {
                ingredients: this.request,
                pageNumber: page
            };
            requestSearch_2.send(JSON.stringify(message));
        }
        else {
            this.onsearched = input;
            this.search(1);
        }
    };
    return SearcherByIngredients;
}());
