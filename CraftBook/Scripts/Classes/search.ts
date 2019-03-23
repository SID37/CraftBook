type SearchListener = (html: string, me: ISearchEnginePages) => void;

interface ISearchEnginePages {
    search(page: number): void;
    search(listener: SearchListener): void;
}

interface ISearchView {
    onsearch: (searcher: ISearchEnginePages) => void;
}

class SearcherByStringView implements ISearchView{
    private form: HTMLFormElement;
    private data: HTMLInputElement;
    onsearch: (searcher: ISearchEnginePages) => void;
    constructor(form: HTMLFormElement) {
        this.form = form;
        this.data = this.form.querySelector('input[name="searchString"]') as HTMLInputElement;

        this.form.onsubmit = () => {
            const str = this.data.value;
            if (str) {
                let searcher = new SearcherByString(str);
                this.onsearch(searcher);
            }
            return false;
        }
    }
}

class SearcherByString implements ISearchEnginePages {
    private request: string;
    private onsearched: SearchListener;

    constructor(request: string) {
        this.request = request.slice();
    }

    search(page: number): void;
    search(listener: SearchListener): void;
    search(input: number | ((html: string, me: ISearchEnginePages) => void)): void {
        if (typeof (input) == "number") {
            const page = input as number;
            const requestSearch = new XMLHttpRequest();
            requestSearch.onloadend = () => {
                if (requestSearch.status === 404) {
                    //TODO как-то сообщить пользователю
                    console.log(`По запросу "${this.request}" ответ: 404`);
                    return;
                }
                this.onsearched(requestSearch.response, this);
            }
            requestSearch.open("POST", "/Recipes/SearchByString", true);
            requestSearch.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            requestSearch.send(`searchString=${encodeURIComponent(this.request)}&pageNumber=${page}`);
        } else {
            this.onsearched = input as SearchListener;
            this.search(1);
        }
    }
}

class SearchByIngredientsView implements ISearchView{
    private button: HTMLElement;
    private data: Inventory;
    onsearch: (searcher: ISearchEnginePages) => void;
    constructor(button: HTMLElement, sourse: Inventory) {
        this.button = button;
        this.data = sourse;
        this.button.onclick = () => {
            const ingredients = this.data.getIngredients();
            if (ingredients) {
                let searcher = new SearcherByIngredients(ingredients);
                this.onsearch(searcher);
            }
            return false;
        }
    }
}


class SearcherByIngredients implements ISearchEnginePages {
    private request: IngredientModel[];
    private onsearched: SearchListener;

    constructor(request: IngredientModel[]) {
        this.request = request.slice();
    }

    search(page: number): void;
    search(listener: SearchListener): void;
    search(input: number | ((html: string, me: ISearchEnginePages) => void)): void {
        if (typeof (input) == "number") {
            const page = input as number;
            const requestSearch = new XMLHttpRequest();
            requestSearch.onloadend = () => {
                if (requestSearch.status === 404) {
                    //TODO как-то сообщить пользователю
                    console.log(`По запросу "${this.request}" ответ: 404`);
                    return;
                }
                this.onsearched(requestSearch.response, this);
            }
            requestSearch.open("POST", "/Recipes/SearchByIngredients", true);
            requestSearch.setRequestHeader("Content-Type", "application/json");
            const message = {
                ingredients: this.request,
                pageNumber: page
            };
            requestSearch.send(JSON.stringify(message));
        } else {
            this.onsearched = input as SearchListener;
            this.search(1);
        }
    }
}

class PsevdoSearcherByFavors implements ISearchEnginePages {
    search(page: number): void;
    search(listener: (html: string, me: ISearchEnginePages) => void): void;
    search(input: number | ((html: string, me: ISearchEnginePages) => void)): void {
        if (typeof (input) == "number") {
            const page = input as number;
            const requestSearch = new XMLHttpRequest();
            requestSearch.onloadend = () => {
                if (requestSearch.status === 404) {
                    //TODO как-то сообщить пользователю
                    console.log(`По запросу "${this.request}" ответ: 404`);
                    return;
                }
                this.onsearched(requestSearch.response, this);
            }
            requestSearch.open("POST", "/Recipes/PageInListId", true);
            requestSearch.setRequestHeader("Content-Type", "application/json");
            const message = {
                recipes: this.request,
                pageNumber: page
            };
            requestSearch.send(JSON.stringify(message));
        } else {
            this.onsearched = input as SearchListener;
            this.search(1);
        }
    }
    private request: Array<Number>;
    private onsearched: SearchListener;
    constructor(favors: Array<Number>) {
        this.request = favors;
    }
}

class PsevdoSearcherByFavorsView implements ISearchView{
    onsearch: (searcher: ISearchEnginePages) => void;

    constructor(button: HTMLElement, favors: ListFavoriteRecipes) {
        button.onclick = () => {
            this.onsearch(new PsevdoSearcherByFavors(favors.get()));
        };
    }
}