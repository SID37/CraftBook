class ErrorView {
    private view: HTMLElement;
    private parent: HTMLElement;
    constructor(node: HTMLElement) {
        this.parent = node;
        this.view = document.createElement("div");
        this.view.classList.add("error");
        node.insertAdjacentElement("beforebegin", this.view);
    }

    display(flag: boolean, message?: string) {
        if (message)
            this.view.textContent = message;
        if (flag)
            this.view.style.display = "initial";
        else
            this.view.style.display = "none";
    }
}