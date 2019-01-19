class Inventory {
    addator: IngredientAddatorView;
    listIngridients: ListIngredients;
    listRecipes: ListRecipes;

    constructor() {
        this.addator = new IngredientAddatorView();
        this.listIngridients =
            new ListIngredients((document.querySelector("article.inventory form.list-ingredients")) as HTMLFormElement);
        this.listRecipes = new ListRecipes(document.querySelector('article.recipe_list') as HTMLElement);
        this.listRecipes.search("");
        this.listIngridients.onshearch = (list) => {
            this.listRecipes.search(list);
        };
        var ss = new SearchString;
        ss.onshearch = (str: string) => { this.listRecipes.search(str); };
        this.addator.onadded = this.listIngridients.addIngredient;
    }
}

let inventory = new Inventory();