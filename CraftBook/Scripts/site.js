{
    var listRecipes_1 = new ListRecipes(document.querySelector('article.recipe_list'));
    var defaultSeacher = new SearcherByString("");
    defaultSeacher.search(function (html, me) { listRecipes_1.setList(html, me); });
    var ss_form = document.querySelector('form[action="/Recipes/SearchByString"');
    if (ss_form) {
        var ss = new SearcherByStringView(ss_form);
        ss.onsearch = function (searcher) {
            searcher.search(function (html, me) { listRecipes_1.setList(html, me); });
        };
    }
    var inventory = new Inventory();
    var searchByIngr = new SearchByIngredientsView(document.querySelector('input[name="find_recept_by_ingr"]'), inventory);
    searchByIngr.onsearch = function (searcher) {
        searcher.search(function (html, me) { listRecipes_1.setList(html, me); });
    };
}
