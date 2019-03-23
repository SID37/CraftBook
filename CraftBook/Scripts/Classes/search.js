class SearcherByStringView {
    constructor(form) {
        this.form = form;
        this.data = this.form.querySelector('input[name="searchString"]');
        this.form.onsubmit = () => {
            const str = this.data.value;
            if (str) {
                let searcher = new SearcherByString(str);
                this.onsearch(searcher);
            }
            return false;
        };
    }
}
class SearcherByString {
    constructor(request) {
        this.request = request.slice();
    }
    search(input) {
        if (typeof (input) == "number") {
            const page = input;
            const requestSearch = new XMLHttpRequest();
            requestSearch.onloadend = () => {
                if (requestSearch.status === 404) {
                    //TODO как-то сообщить пользователю
                    console.log(`По запросу "${this.request}" ответ: 404`);
                    return;
                }
                this.onsearched(requestSearch.response, this);
            };
            requestSearch.open("POST", "/Recipes/SearchByString", true);
            requestSearch.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            requestSearch.send(`searchString=${encodeURIComponent(this.request)}&pageNumber=${page}`);
        }
        else {
            this.onsearched = input;
            this.search(1);
        }
    }
}
class SearchByIngredientsView {
    constructor(button, sourse) {
        this.button = button;
        this.data = sourse;
        this.button.onclick = () => {
            const ingredients = this.data.getIngredients();
            if (ingredients) {
                let searcher = new SearcherByIngredients(ingredients);
                this.onsearch(searcher);
            }
            return false;
        };
    }
}
class SearcherByIngredients {
    constructor(request) {
        this.request = request.slice();
    }
    search(input) {
        if (typeof (input) == "number") {
            const page = input;
            const requestSearch = new XMLHttpRequest();
            requestSearch.onloadend = () => {
                if (requestSearch.status === 404) {
                    //TODO как-то сообщить пользователю
                    console.log(`По запросу "${this.request}" ответ: 404`);
                    return;
                }
                this.onsearched(requestSearch.response, this);
            };
            requestSearch.open("POST", "/Recipes/SearchByIngredients", true);
            requestSearch.setRequestHeader("Content-Type", "application/json");
            const message = {
                ingredients: this.request,
                pageNumber: page
            };
            requestSearch.send(JSON.stringify(message));
        }
        else {
            this.onsearched = input;
            this.search(1);
        }
    }
}
class PsevdoSearcherByFavors {
    search(input) {
        if (typeof (input) == "number") {
            const page = input;
            const requestSearch = new XMLHttpRequest();
            requestSearch.onloadend = () => {
                if (requestSearch.status === 404) {
                    //TODO как-то сообщить пользователю
                    console.log(`По запросу "${this.request}" ответ: 404`);
                    return;
                }
                this.onsearched(requestSearch.response, this);
            };
            requestSearch.open("POST", "/Recipes/PageInListId", true);
            requestSearch.setRequestHeader("Content-Type", "application/json");
            const message = {
                recipes: this.request,
                pageNumber: page
            };
            requestSearch.send(JSON.stringify(message));
        }
        else {
            this.onsearched = input;
            this.search(1);
        }
    }
    constructor(favors) {
        this.request = favors;
    }
}
class PsevdoSearcherByFavorsView {
    constructor(button, favors) {
        button.onclick = () => {
            this.onsearch(new PsevdoSearcherByFavors(favors.get()));
        };
    }
}
