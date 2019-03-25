class IngredientModel {
    quantity: number;
    id: number;
    name: string;
    unitShortName: string;
}

class IngredientView {
    main: HTMLElement;
    private name: HTMLElement;
    private volume: HTMLElement;
    //private unit: HTMLInputElement;
    private button: HTMLInputElement;
    ondeleted: (v: IngredientView) => void;
    delete = () => {
        this.button.onclick(null);
    }

    constructor(soul: IngredientModel) {
        this.main = document.createElement("div") as HTMLElement;
        this.main.classList.add("fieldform");
        this.main.innerHTML = //'<div class="fieldform">' +
            '<span class="name"></span>' +
            '<span class="volume"></span>' +
            //'<input type="text" name="unit" readonly />' +
            //'</div>' +
            '<input type="image" name="del_ingredient" src="/images/ingredient/close.svg" />';
        this.button = (this.main.querySelector("input[type=\"image\"") as HTMLInputElement);
        this.button.onclick = () => {
            this.main.remove();
            this.ondeleted(this);
            return false;
        };
        this.name = this.main.querySelector('span[class="name"]') as HTMLElement;
        //this.unit = this.main.querySelector('input[name="unit"]') as HTMLInputElement;
        this.volume = this.main.querySelector('span[class="volume"]') as HTMLElement;

        this.name.textContent = soul.name;
        this.volume.textContent = `${soul.quantity} ${soul.unitShortName}`;
        //this.unit.value = soul.unitShortName;
    }

}

//Отвечает за список ингредиентов в инвентаре
class ListIngredients {
    private views: Array<IngredientView>;
    private models: Array<IngredientModel>;
    private headNode: HTMLFormElement;
    private storage: ListInStorage<IngredientModel>;

    getIngredients(): Array<IngredientModel> {
        return this.models;
    }

    constructor(node: HTMLFormElement, temporary: boolean = false, name: string = "listIngredient") {
        this.headNode = node;
        this.storage = new ListInStorage<IngredientModel>(name, temporary);
        this.views = new Array<IngredientView>();
        this.models = this.storage.getList();
        this.models.forEach(this.addView());
        this.headNode.onsubmit = () => {
            return false;
        }
    }

    clean() {
        this.storage.setList(new Array<IngredientModel>());
        this.models = this.storage.getList();
    }

    //Лямбдой - чтоб можно было передавать как callback и this не теряла контекст
    addIngredient = (model: IngredientModel) => {
        //на случай, если добавляемый ингредиент уже есть
        let find = this.models.filter((model_: IngredientModel) => model_.id === model.id);
        if (find != null && find.length !== 0) {
            let j = this.models.lastIndexOf(find[0]);
            this.views[j].delete();
        }
        const index = this.models.length;
        this.models[index] = model;
        this.addView()(this.models[index], index, this.models);

    }
    //Лямбдой - чтоб можно было передавать как callback и this не теряла контекст
    private addView(): (value: IngredientModel, index: number, array: IngredientModel[]) => void {
        return (soul: IngredientModel, i: number) => {
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

class IngredientAddatorView {
    private name: HTMLInputElement;
    private btnAdd: HTMLInputElement;
    private count: HTMLInputElement;
    private unit: HTMLInputElement;
    private form: HTMLFormElement;
    private error: ErrorView;
    onadded: (model: IngredientModel) => void;

    constructor() {
        this.name = document.querySelector("article.inventory input[type=\"text\"]") as HTMLInputElement;
        this.btnAdd = document.getElementById("buttonAddIngridient") as HTMLInputElement;
        this.count = document.querySelector("article.inventory input[type=\"number\"]") as HTMLInputElement;
        this.unit =
            document.querySelector("article.inventory input[name=\"ingredient_unit\"]") as HTMLInputElement;
        this.form = document.querySelector("article.inventory form.add-ingredient") as HTMLFormElement;
        this.error = new ErrorView(this.form);

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
                } else {
                    this.unit.value = tmp.getAttribute("label");
                }
            });
        //Запрашиваем у сервера корректность ингредиента
        this.form.onsubmit = (event: Event) => {
            this.name.setCustomValidity("");
            //заглушение исключений ради того, чтобы страничка не обновлялась при сбое скрипта
            try {
                if (this.unit.value === "") {
                    this.error.display("Такого ингредиента не существует");
                    return false;
                }
                this.error.display(false);
                const requestAdd = new XMLHttpRequest();
                requestAdd.open("POST", "/IngredientQuant/FindName", true);
                requestAdd.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                requestAdd.onloadend = () => {
                    const response = JSON.parse(requestAdd.response);
                    if (response.message != null) {
                        this.error.display(response.message);
                        return;
                    }

                    this.onadded(response);
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
    private addator: IngredientAddatorView;
    private listIngridients: ListIngredients;
    getIngredients(): IngredientModel[] {
        return this.listIngridients.getIngredients();
    }

    delIngredients() {
        this.listIngridients.clean();
    }
    constructor(temporary: boolean = false) {
        this.addator = new IngredientAddatorView();
        this.listIngridients =
            new ListIngredients((document.querySelector("article.inventory form.list-ingredients")) as HTMLFormElement, temporary);
        this.addator.onadded = this.listIngridients.addIngredient;
    }
}