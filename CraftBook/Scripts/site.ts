{
    let favoursRecipes = new ListFavoriteRecipes();
    let listRecipes = new ListRecipes(document.querySelector('article.recipe_list') as HTMLElement, favoursRecipes);

    let defaultSeacher = new SearcherByString("");
    defaultSeacher.search((html, me) => { listRecipes.setList(html, me); });

    let ss_form = document.querySelector('form[action="/Recipes/SearchByString"') as HTMLFormElement;
    if (ss_form) {
        let ss = new SearcherByStringView(ss_form);
        ss.onsearch = (searcher: ISearchEnginePages) => {
            searcher.search((html, me) => { listRecipes.setList(html, me); });
        };
    }


    let inventory = new Inventory();

    let searchByIngr = new SearchByIngredientsView(document.querySelector('input[name="find_recept_by_ingr"]') as HTMLElement, inventory);
    searchByIngr.onsearch = (searcher: ISearchEnginePages) => {
        searcher.search((html, me) => { listRecipes.setList(html, me); });
    };
}
