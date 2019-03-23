class IngredientModel {
}
class IngredientView {
    constructor(soul) {
        this.delete = () => {
            this.button.onclick(null);
        };
        this.main = document.createElement("div");
        this.main.classList.add("fieldform");
        this.main.innerHTML = //'<div class="fieldform">' +
            '<span class="name"></span>' +
                '<span class="volume"></span>' +
                //'<input type="text" name="unit" readonly />' +
                //'</div>' +
                '<input type="image" name="del_ingredient" src="/images/ingredient/close.svg" />';
        this.button = this.main.querySelector("input[type=\"image\"");
        this.button.onclick = () => {
            this.main.remove();
            this.ondeleted(this);
            return false;
        };
        this.name = this.main.querySelector('span[class="name"]');
        //this.unit = this.main.querySelector('input[name="unit"]') as HTMLInputElement;
        this.volume = this.main.querySelector('span[class="volume"]');
        this.name.textContent = soul.name;
        this.volume.textContent = `${soul.quantity} ${soul.unitShortName}`;
        //this.unit.value = soul.unitShortName;
    }
}
//Отвечает за список ингредиентов в инвентаре
class ListIngredients {
    constructor(node, temporary = false, name = "listIngredient") {
        //Лямбдой - чтоб можно было передавать как callback и this не теряла контекст
        this.addIngredient = (model) => {
            //на случай, если добавляемый ингредиент уже есть
            let find = this.models.filter((model_) => model_.id === model.id);
            if (find != null && find.length !== 0) {
                let j = this.models.lastIndexOf(find[0]);
                this.views[j].delete();
            }
            const index = this.models.length;
            this.models[index] = model;
            this.addView()(this.models[index], index, this.models);
        };
        this.headNode = node;
        this.storage = new ListInStorage(name, temporary);
        this.views = new Array();
        this.models = this.storage.getList();
        this.models.forEach(this.addView());
        this.headNode.onsubmit = () => {
            return false;
        };
    }
    getIngredients() {
        return this.models;
    }
    //Лямбдой - чтоб можно было передавать как callback и this не теряла контекст
    addView() {
        return (soul, i) => {
            this.views[i] = new IngredientView(soul);
            this.views[i].ondeleted = (view) => {
                let j = this.views.lastIndexOf(view);
                this.models.splice(j, 1);
                this.views.splice(j, 1);
            };
            this.headNode.appendChild(this.views[i].main);
        };
    }
}
class IngredientAddatorView {
    constructor() {
        this.name = document.querySelector("article.inventory input[type=\"text\"]");
        this.btnAdd = document.getElementById("buttonAddIngridient");
        this.count = document.querySelector("article.inventory input[type=\"number\"]");
        this.unit =
            document.querySelector("article.inventory input[name=\"ingredient_unit\"]");
        this.form = document.querySelector("article.inventory form.add-ingredient");
        this.error = new ErrorView(this.form);
        //Подсказки при вводе
        this.name.addEventListener("input", () => {
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
            };
            requestSearch.send(`nameChip=${encodeURIComponent(nameChip)}`);
        });
        //Окончание ввода названия ингредиента - устанавливаем единицы измерения
        this.name.addEventListener("change", () => {
            const nameChip = this.name.value;
            const tmp = document.querySelector(`option[value="${nameChip}"`);
            if (tmp == null) {
                this.unit.value = null;
            }
            else {
                this.unit.value = tmp.getAttribute("label");
            }
        });
        //Запрашиваем у сервера корректность ингредиента
        this.form.onsubmit = (event) => {
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
            }
            catch (e) {
                console.log(e.toString());
                return false;
            }
            return false;
        };
    }
}
class Inventory {
    getIngredients() {
        return this.listIngridients.getIngredients();
    }
    constructor(temporary = false) {
        this.addator = new IngredientAddatorView();
        this.listIngridients =
            new ListIngredients((document.querySelector("article.inventory form.list-ingredients")), temporary);
        this.addator.onadded = this.listIngridients.addIngredient;
    }
}
