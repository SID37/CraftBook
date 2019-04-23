class ErrorView {
    constructor(node) {
        this.parent = node;
        this.view = document.createElement("div");
        this.view.classList.add("error");
        node.insertAdjacentElement("beforebegin", this.view);
        this.display(false);
    }
    display(message) {
        if (message) {
            if (typeof message == "string")
                this.view.textContent = message;
            this.view.style.display = "initial";
            this.view.scrollIntoView();
        }
        else
            this.view.style.display = "none";
    }
}
