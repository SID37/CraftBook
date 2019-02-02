class ErrorView {
    private view: HTMLElement;
    private parent: HTMLElement;
    constructor(node: HTMLElement) {
        this.parent = node;
        this.view = document.createElement("div");
        this.view.classList.add("error");
        node.insertAdjacentElement("beforebegin", this.view);
        this.display(false);
    }

    display(message: string|boolean) {
        if (message) {
            if (typeof message == "string")
                this.view.textContent = message;
            this.view.style.display = "initial";
        } else
            this.view.style.display = "none";
    }
}