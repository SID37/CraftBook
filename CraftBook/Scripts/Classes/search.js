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
