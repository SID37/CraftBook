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

    search(list: IngredientModel[]): void;
    search(a: any, page: number);
    search(a: any, page: number = 1): void {

        const requestSearch = new XMLHttpRequest();
        requestSearch.onloadend = () => {
            if (requestSearch.status === 404)
                return;
            while (this.headNode.hasChildNodes())
                this.headNode.removeChild(this.headNode.firstChild);
            this.headNode.insertAdjacentHTML("beforeend", requestSearch.response);
            this.headNode.querySelectorAll(".page").forEach((btn: HTMLElement) => {
                new ListRecipesButton(btn).onclick = (page: number) => {
                    this.search(a, page);
                }
            });
        }
        if (typeof (a) == "object") {
            const list = a as IngredientModel[];
            requestSearch.open("POST", "/Recipes/SearchByIngredients", true);
            requestSearch.setRequestHeader("Content-Type", "application/json");
            let message =
            {
                ingredients: list,
                pageNumber: page
            }
            requestSearch.send(JSON.stringify(message));
        }
    };

    setList(html: string, searcher: ISearchEnginePages): void {
        while (this.headNode.hasChildNodes())
            this.headNode.removeChild(this.headNode.firstChild);
        this.headNode.insertAdjacentHTML("beforeend", html);
        this.headNode.querySelectorAll(".page").forEach((btn: HTMLElement) => {
            new ListRecipesButton(btn).onclick = (page: number) => {
                searcher.search(page);
            }
        });
    }

    constructor(node: HTMLElement) {
        this.headNode = node;
    }
}
