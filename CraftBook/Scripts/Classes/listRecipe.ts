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

        //TODO так как теперь вместо img используется div с фоновым изображением, мы потеряли событие error
        /*this.headNode.querySelectorAll(".recipe_avatar").forEach((div: HTMLDivElement) => {
            div.addEventListener("error",
                () => {
                    div.style.backgroundImage = "url(../images/default.png)";
                });
        });*/
    }

    constructor(node: HTMLElement) {
        this.headNode = node;
    }
}
