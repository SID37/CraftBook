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
    private favors: ListFavoriteRecipes;
    setList(html: string, searcher: ISearchEnginePages): void {
        while (this.headNode.hasChildNodes())
            this.headNode.removeChild(this.headNode.firstChild);
        this.headNode.insertAdjacentHTML("beforeend", html);
        this.headNode.querySelectorAll(".page").forEach((btn: HTMLElement) => {
            new ListRecipesButton(btn).onclick = (page: number) => {
                searcher.search(page);
            }
        });

        this.headNode.querySelectorAll("article.recipe-preview").forEach((recipe:
            HTMLDivElement) => {
            let id = parseInt(recipe.id.substr(1));
            new FavoriteMarkView(recipe.querySelector("section > header > img") as HTMLImageElement, this.favors.has(id))
                .onChangeMode = (m) => {
                    console.log(m+" "+id);
                    if (m)
                        this.favors.add(id);
                    else
                        this.favors.delete(id);
                };
        });

        //TODO так как теперь вместо img используется div с фоновым изображением, мы потеряли событие error
        /*this.headNode.querySelectorAll(".recipe_avatar").forEach((div: HTMLDivElement) => {
            div.addEventListener("error",
                () => {
                    div.style.backgroundImage = "url(../images/default.png)";
                });
        });*/
        this.headNode.scrollIntoView();
    }

    constructor(node: HTMLElement, favors: ListFavoriteRecipes) {
        this.headNode = node;
        this.favors = favors;
    }
}

class FavoriteMarkView {
    private img: HTMLImageElement;
    private mode: boolean;
    onChangeMode: (mode: boolean) => void;

    constructor(node: HTMLImageElement, mode: boolean = false) {
        this.img = node;
        this.setMode(mode);
        this.img.onclick = () => {
            this.setMode(!this.mode);
        };
    }

    setMode(mode: boolean) {
        this.mode = mode;
        if (mode)
            this.img.src = "/images/bookmark-active.svg";
        else 
            this.img.src = "/images/bookmark-passive.svg";
        if (this.onChangeMode)
            this.onChangeMode(mode);
    }
}

class ListFavoriteRecipes {
    ids: Set<Number>;
    private storage: SetInStorage<Number>;

    constructor() {
        this.storage = new SetInStorage<Number>("favoriteRecipes", false);
        this.ids = this.storage.getList();
    }

    get() {
        return Array.from(this.ids.values());
    }

    add(id: Number) {
        this.ids.add(id);
    }

    delete(id: number) {
        this.ids.delete(id);
    }

    has(id: number) {
        return this.ids.has(id);
    }
}