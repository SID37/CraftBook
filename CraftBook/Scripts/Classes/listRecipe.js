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
