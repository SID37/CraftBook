class ListRecipesButton {
    constructor(element) {
        this.btn = element;
        if (this.btn.id !== "currentPage") {
            this.btn.onclick = ev => {
                this.onclick(parseInt(this.btn.textContent));
            };
        }
    }
}
class ListRecipes {
    setList(html, searcher) {
        while (this.headNode.hasChildNodes())
            this.headNode.removeChild(this.headNode.firstChild);
        this.headNode.insertAdjacentHTML("beforeend", html);
        this.headNode.querySelectorAll(".page").forEach((btn) => {
            new ListRecipesButton(btn).onclick = (page) => {
                searcher.search(page);
            };
        });
        this.headNode.querySelectorAll("article.recipe-preview").forEach((recipe) => {
            let id = parseInt(recipe.id.substr(1));
            new FavoriteMarkView(recipe.querySelector("section > header > img"), this.favors.has(id))
                .onChangeMode = (m) => {
                console.log(m + " " + id);
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
    }
    constructor(node, favors) {
        this.headNode = node;
        this.favors = favors;
    }
}
class FavoriteMarkView {
    constructor(node, mode = false) {
        this.img = node;
        this.setMode(mode);
        this.img.onclick = () => {
            this.setMode(!this.mode);
        };
    }
    setMode(mode) {
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
    constructor() {
        this.storage = new SetInStorage("favoriteRecipes", false);
        this.ids = this.storage.getList();
    }
    get() {
        return Array.from(this.ids.values());
    }
    add(id) {
        this.ids.add(id);
    }
    delete(id) {
        this.ids.delete(id);
    }
    has(id) {
        return this.ids.has(id);
    }
}
