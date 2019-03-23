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

        this.headNode.querySelectorAll("article.recipe-preview").forEach((recipe:
            HTMLDivElement) => {
            let id = parseInt(recipe.id.substr(1));
            new FavoriteMarkView(recipe.querySelector("section > header > img") as HTMLImageElement)
                .onChangeMode = (m) => { console.log(m+" "+id); };
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

class ListFavoriteRecipes
{
    private ids: Array<Number>;
    private storage: ListInStorage<Number>;

    constructor() {
        this.storage = new ListInStorage<Number>("favoriteRecipes", false);
        this.ids = this.storage.getList();
    }

    get() {
        return this.ids;
    }

    add(id: Number) {
        this.ids.push(id);
    }
}