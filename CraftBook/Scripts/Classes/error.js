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
