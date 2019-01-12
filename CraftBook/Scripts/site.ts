

class IngredientSoul {
    quantity: number;
    id: number;
    name: string;
    unitShortName: string;
}

class IngredientView {
    main: HTMLElement;
    private name: HTMLInputElement;
    private volume: HTMLInputElement;
    private unit: HTMLInputElement;
    private button: HTMLInputElement;
    ondeleted: (v: IngredientView) => void;
    delete = () => {
        this.button.onclick(null);
    }
    constructor(soul: IngredientSoul) {
        this.main = document.createElement("div") as HTMLElement;
        this.main.classList.add("fieldform");
        this.main.innerHTML = '<div class="in-frame">' +
            '<input type="text" name="name" readonly />' +
            '<input type="number" name="volume" readonly />' +
            '<input type="text" name="unit" readonly />' +
            '</div>' +
            '<input type="image" name="del_ingredient" src="/images/close.svg" />';
        this.button = (this.main.querySelector("input[type=\"image\"") as HTMLInputElement);
        this.button.onclick = () => {
            this.main.remove();
            this.ondeleted(this);
            return false;
        };
        this.name = this.main.querySelector('input[name="name"]') as HTMLInputElement;
        this.unit = this.main.querySelector('input[name="unit"]') as HTMLInputElement;
        this.volume = this.main.querySelector('input[name="volume"]') as HTMLInputElement;

        this.name.value = soul.name;
        this.volume.value = soul.quantity.toString();
        this.unit.value = soul.unitShortName;
    }

}

//Отвечает за список ингредиентов в инвентаре
class ListIngredients {
    private views: Array<IngredientView>;
    private models: Array<IngredientSoul>;
    private key = "listIngredient";
    private headNode: HTMLFormElement;
    onshearch: (listIngredients: Array<IngredientSoul>) => void;

    constructor(node: HTMLFormElement) {
        this.headNode = node;
        this.models = JSON.parse(localStorage.getItem(this.key)) as Array<IngredientSoul>;
        this.views = new Array<IngredientView>();
        if (this.models == null)
            this.models = new Array<IngredientSoul>();
        else
            this.models.forEach(this.addView());
        window.addEventListener("unload", () => { localStorage.setItem(this.key, JSON.stringify(this.models)); });
        this.headNode.onsubmit = () => {
            this.onshearch(this.models);

            return false;
        }
    }

    addIngredient = (data: string) => {
        const soul = (JSON.parse(data) as IngredientSoul);
        //на случай, если добавляемый ингредиент уже есть
        let find = this.models.filter((model: IngredientSoul) => model.id === soul.id);
        if (find != null && find.length !== 0) {
            let j = this.models.lastIndexOf(find[0]);
            this.views[j].delete();
        }
        const index = this.models.length;
        this.models[index] = soul;
        this.addView()(this.models[index], index, this.models);

    }

    private addView(): (value: IngredientSoul, index: number, array: IngredientSoul[]) => void {
        return (soul: IngredientSoul, i: number) => {
            this.views[i] = new IngredientView(soul);
            this.views[i].ondeleted = (view: IngredientView) => {
                let j = this.views.lastIndexOf(view);
                this.models.splice(j, 1);
                this.views.splice(j, 1);
            };
            this.headNode.appendChild(this.views[i].main);
        };
    }
}

class SearchString {
    form: HTMLFormElement;
    data: HTMLInputElement;
    onshearch: (searchString: string) => void;

    constructor() {
        this.form = document.querySelector('form[action="/Recipes/SearchByString"') as HTMLFormElement;
        this.data = this.form.querySelector('input[name="searchString"]') as HTMLInputElement;

        this.form.onsubmit = () => {
            const str = this.data.value;
            if (str)
                this.onshearch(str);
            return false;
        }
    }
}

class ListRecipes {
    private headNode: HTMLElement;

    search(str: string): void;
    search(list: IngredientSoul[]): void;
    search(a: any, page: number = 1): void {
        if (typeof (a) == "string") {
            const str = a as string;
            const requestSearch = new XMLHttpRequest();
            requestSearch.open("POST", "/Recipes/SearchByString", true);
            requestSearch.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            requestSearch.onloadend = () => {
                if (requestSearch.status === 404)
                    return;
                while (this.headNode.hasChildNodes())
                    this.headNode.removeChild(this.headNode.firstChild);
                this.headNode.insertAdjacentHTML("beforeend", requestSearch.response);
            }
            requestSearch.send(`searchString=${encodeURIComponent(str)}&pageNumber=${page}`);
        } else if (typeof (a) == "object") {
            const list = a as IngredientSoul[];
            let requestSearch = new XMLHttpRequest();
            requestSearch.open("POST", "/Recipes/SearchByIngredients", true);
            requestSearch.setRequestHeader("Content-Type", "application/json");
            requestSearch.onloadend = () => {
                if (requestSearch.status === 404)
                    return;
                while (this.headNode.hasChildNodes())
                    this.headNode.removeChild(this.headNode.firstChild);
                this.headNode.insertAdjacentHTML("beforeend", requestSearch.response);
            }
            let message =
            {
                ingredients: list,
                pageNumber: page
            }
            requestSearch.send(JSON.stringify(message));
        }
    };

    constructor(node: HTMLElement) {
        this.headNode = node;
    }
}

class IngredientAddatorView {
    private name: HTMLInputElement;
    private btnAdd: HTMLInputElement;
    private count: HTMLInputElement;
    private unit: HTMLInputElement;
    private form: HTMLFormElement;

//    onadded: (model: IngredientSoul) => void;
    onadded: (model: string) => void;

    constructor() {
        this.name = document.querySelector("article.inventory input[type=\"text\"]") as HTMLInputElement;
        this.btnAdd = document.getElementById("buttonAddIngridient") as HTMLInputElement;
        this.count = document.querySelector("article.inventory input[type=\"number\"]") as HTMLInputElement;
        this.unit =
            document.querySelector("article.inventory input[name=\"ingredient_unit\"]") as HTMLInputElement;
        this.form = document.querySelector("article.inventory form.add-ingredient") as HTMLFormElement;
        //Подсказки при вводе
        this.name.addEventListener("input",
            () => {
                let nameChip = this.name.value;
                console.log(nameChip);
                if (nameChip.length === 0)
                    return;
                if (document.querySelector(`option[value="${nameChip}"`))
                    return;
                let requestSearch = new XMLHttpRequest();
                requestSearch.open("POST", "/Ingredients/Index", true);
                requestSearch.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                requestSearch.onloadend = () => {
                    if (requestSearch.status === 404)
                        return;
                    let tmp = document.querySelector("datalist[id=\"ingredients\"");
                    if (tmp != null)
                        tmp.parentNode.removeChild(tmp);
                    this.form.insertAdjacentHTML("afterend", requestSearch.response);
                }
                requestSearch.send(`nameChip=${encodeURIComponent(nameChip)}`);
            });
        //Окончание ввода названия ингредиента - устанавливаем единицы измерения
        this.name.addEventListener("change",
            () => {
                const nameChip = this.name.value;
                const tmp = document.querySelector(`option[value="${nameChip}"`);
                if (tmp == null) {
                    this.unit.value = null;
                    this.btnAdd.style.visibility = "hidden";
                } else {
                    this.unit.value = tmp.getAttribute("label");
                    this.btnAdd.style.visibility = "visible";
                }
            });
        //Добавление ингредиента в список
        this.form.onsubmit = (event: Event) => {
            try {
                if (this.unit.value === "") {
                    return false;
                }
                const requestAdd = new XMLHttpRequest();
                requestAdd.open("POST", "/IngredientQuant/FindName", true);
                requestAdd.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                requestAdd.onloadend = () => {
                    //todo нормально как-то
                    if (requestAdd.status === 404) {
                        alert('ингредиент не найден!');
                        return;
                    }
                    this.onadded(requestAdd.response);
                    this.count.value = null;
                    this.name.value = null;
                    this.unit.value = null;
                };
                const name = this.name.value;
                const count = this.count.value;
                requestAdd.send(`ingredientName=${encodeURIComponent(name)}&volume=${encodeURIComponent(count)}`);

            } catch (e) {
                console.log(e.toString());
                return false;
            }
            return false;
        }
    }
}

class Inventory {
    addator: IngredientAddatorView;
    listIngridients: ListIngredients;
    listRecipes: ListRecipes;

    constructor() {
        this.addator = new IngredientAddatorView();
        this.listIngridients =
            new ListIngredients((document.querySelector("article.inventory form.list-ingredients")) as HTMLFormElement);
        this.listRecipes = new ListRecipes(document.querySelector('article.recipe_list') as HTMLElement);
        this.listIngridients.onshearch = (list) => {
            this.listRecipes.search(list);
        };
        var ss = new SearchString;
        ss.onshearch = (str: string) => { this.listRecipes.search(str); };
        this.addator.onadded = this.listIngridients.addIngredient;
    }
}

let inventory = new Inventory();