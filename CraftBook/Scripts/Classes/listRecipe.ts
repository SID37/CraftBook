class ListRecipesButton {
    btn: HTMLElement;

    constructor(element: HTMLElement) {
        this.btn = element;
        if (this.btn.id !== "currentPage") {
            this.btn.onclick = ev => {
                this.onclick(parseInt(this.btn.textContent));
            };
        }
    }

    onclick: (value: number) => void;
}

class ListRecipes {
    private headNode: HTMLElement;

    setList(html: string, searcher: ISearchEnginePages): void {
        while (this.headNode.hasChildNodes())
            this.headNode.removeChild(this.headNode.firstChild);
        this.headNode.insertAdjacentHTML("beforeend", html);
        this.headNode.querySelectorAll(".page").forEach((btn: HTMLElement) => {
            new ListRecipesButton(btn).onclick = (page: number) => {
                searcher.search(page);
            }
        });

        this.headNode.querySelectorAll("img").forEach((img: HTMLImageElement) => {
            img.addEventListener("error",
                () => {
                    img.src = "/images/default.png";
                });
        });
    }

    constructor(node: HTMLElement) {
        this.headNode = node;
    }
}
