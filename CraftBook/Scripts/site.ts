class Inventory {
    addator: IngredientAddatorView;
    listIngridients: ListIngredients;

    constructor() {
        this.addator = new IngredientAddatorView();
        this.listIngridients =
            new ListIngredients((document.querySelector("article.inventory form.list-ingredients")) as HTMLFormElement);
        this.addator.onadded = this.listIngridients.addIngredient;
    }
}

let inventory = new Inventory();
let listRecipes = new ListRecipes(document.querySelector('article.recipe_list') as HTMLElement);

let defaultSeacher = new SearcherByString("");
defaultSeacher.search((html, me) => {listRecipes.setList(html, me);});
inventory.listIngridients.onshearch = (list) => {
    listRecipes.search(list);
};

let ss = new SearcherByStringView;
ss.onshearch = (searcher: ISearchEnginePages) => {
    searcher.search((html, me) => {listRecipes.setList(html, me);});
};
