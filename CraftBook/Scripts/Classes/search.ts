type SearchListener = (html: string, me: ISearchEnginePages) => void;

interface ISearchEnginePages {
    search(page: number): void;
    search(listener: SearchListener): void;
}

interface ISearchView {
    onshearch: (searcher: ISearchEnginePages) => void;
}

class SearcherByStringView implements ISearchView{
    private form: HTMLFormElement;
    private data: HTMLInputElement;
    onshearch: (searcher: ISearchEnginePages) => void;
    constructor() {
        this.form = document.querySelector('form[action="/Recipes/SearchByString"') as HTMLFormElement;
        this.data = this.form.querySelector('input[name="searchString"]') as HTMLInputElement;

        this.form.onsubmit = () => {
            const str = this.data.value;
            if (str) {
                let searcher = new SearcherByString(str);
                this.onshearch(searcher);
            }
            return false;
        }
    }
}

class SearcherByString implements ISearchEnginePages {
    private request: string;
    private onsearched: SearchListener;

    constructor(request: string) {
        this.request = request;
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

class SearchByIngredients {
    private button: HTMLElement;
    constructor(button: HTMLElement) {
        this.button = button;
    }
}

class RecipeSeacher {

}