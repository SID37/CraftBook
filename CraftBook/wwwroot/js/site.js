{
    let favoursRecipes = new ListFavoriteRecipes();
    let listRecipes = new ListRecipes(document.querySelector('article.recipe_list'), favoursRecipes);
    let defaultSeacher = new SearcherByString("");
    defaultSeacher.search((html, me) => { listRecipes.setList(html, me); });
    let ss_form = document.querySelector('form[action="/Recipes/SearchByString"');
    if (ss_form) {
        let ss = new SearcherByStringView(ss_form);
        ss.onsearch = (searcher) => {
            searcher.search((html, me) => { listRecipes.setList(html, me); });
        };
    }
    let inventory = new Inventory();
    let searchByIngr = new SearchByIngredientsView(document.querySelector('input[name="find_recept_by_ingr"]'), inventory);
    searchByIngr.onsearch = (searcher) => {
        searcher.search((html, me) => { listRecipes.setList(html, me); });
    };
    let searchFavor = new PsevdoSearcherByFavorsView(document.getElementById("bookmark"), favoursRecipes);
    searchFavor.onsearch = searcher => {
        searcher.search((html, me) => { listRecipes.setList(html, me); });
    };
}
