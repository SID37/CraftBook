class ErrorView {
    constructor(node) {
        this.parent = node;
        this.view = document.createElement("div");
        this.view.classList.add("error");
        node.insertAdjacentElement("beforebegin", this.view);
        this.display(false);
    }
    display(message) {
        if (message) {
            if (typeof message == "string")
                this.view.textContent = message;
            this.view.style.display = "initial";
        }
        else
            this.view.style.display = "none";
    }
}

class ImageUploader {
    constructor(node, uploaded, mod = "one") {
        let error = new ErrorView(node);
        node.ondrop = (ev) => {
            const data = ev.dataTransfer;
            if (data) {
                if (data.files.length > 0) {
                    ev.preventDefault();
                    if (data.files.length > 1 && mod === "one") {
                        error.display("Здесь можно загрузить только один файл!");
                        return;
                    }
                }
                console.group("files");
                for (let i = 0; i < data.files.length; i++) {
                    let file = data.files[i];
                    if (file.type.match(/image/)) {
                        let uploadRequest = new XMLHttpRequest();
                        console.log(`Отловили файл ${file.name}`);
                        uploadRequest.onloadend = () => {
                            error.display(false);
                            if (uploadRequest.status > 300) {
                                //TODO как-то сообщить пользователю
                                error.display(`Не удалось отправить картинку. Ошибка ${uploadRequest.status}.`);
                                return;
                            }
                            let message = JSON.parse(uploadRequest.response);
                            if (message.message) {
                                error.display(message.message);
                                return;
                            }
                            uploaded(message.link);
                        };
                        uploadRequest.open("POST", "/Images/Create", true);
                        let formData = new FormData();
                        formData.append("image", file);
                        uploadRequest.send(formData);
                    }
                }
                console.groupEnd();
            }
        };
    }
}
class ImageView {
    constructor(imgNode, link) {
        this.img = imgNode;
        if (link)
            this.setLink(link);
    }
    setLink(link) {
        this.img.src = link;
    }
}

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
        this.volume.textContent = soul.quantity == null ? "по вкусу" : `${soul.quantity} ${soul.unitShortName}`;
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
    clean() {
        this.storage.setList(new Array());
        this.models = this.storage.getList();
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
        this.form = document.querySelector("article.inventory form.add-ingredient");
        this.name = document.querySelector("article.inventory input[type=\"text\"]");
        this.btnAdd = document.getElementById("buttonAddIngridient");
        this.count = document.querySelector("article.inventory input[type=\"number\"]");
        this.realUnit = this.form.querySelector(".unit_view");
        this.unit =
            document.querySelector("article.inventory input[name=\"ingredient_unit\"]");
        this.error = new ErrorView(this.form);
        //Подсказки при вводе
        this.name.addEventListener("input", () => {
            let nameChip = this.name.value;
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
                this.realUnit.innerHTML = "<pre>   </pre>";
                this.unit.value = null;
            }
            else {
                this.realUnit.textContent = tmp.getAttribute("label");
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
                    this.realUnit.innerHTML = "<pre>   </pre>";
                    this.name.value = null;
                    this.unit.value = null;
                };
                const name = this.name.value;
                const count = this.count.value;
                requestAdd.send(`ingredientName=${encodeURIComponent(name)}&volume=${count.length > 0 ? encodeURIComponent(count) : "null"}`);
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
    delIngredients() {
        this.listIngridients.clean();
    }
    constructor(temporary = false) {
        this.addator = new IngredientAddatorView();
        this.listIngridients =
            new ListIngredients((document.querySelector("article.inventory form.list-ingredients")), temporary);
        this.addator.onadded = this.listIngridients.addIngredient;
    }
}

class ListInStorage {
    constructor(name, temporary) {
        this.key = name;
        this.storage = temporary ? sessionStorage : localStorage;
        this.list = JSON.parse(this.storage.getItem(this.key));
        if (this.list == null)
            this.list = new Array();
        window.addEventListener("unload", () => { this.storage.setItem(this.key, JSON.stringify(this.list)); });
    }
    getList() {
        return this.list;
    }
    setList(list) {
        this.list = list;
    }
}
class SetInStorage {
    constructor(name, temporary) {
        this.key = name;
        this.storage = temporary ? sessionStorage : localStorage;
        let list = JSON.parse(this.storage.getItem(this.key));
        this.list = new Set(list);
        window.addEventListener("unload", () => { this.storage.setItem(this.key, JSON.stringify(Array.from(this.list.values()))); });
    }
    getList() {
        return this.list;
    }
    setList(list) {
        this.list = list;
    }
}
class ObjectInStorage {
    constructor(name, temporary, geter) {
        this.key = name;
        this.storage = temporary ? sessionStorage : localStorage;
        this.obj = JSON.parse(this.storage.getItem(this.key));
        if (this.obj == null) {
            this.obj = ({});
        }
        window.addEventListener("unload", () => { this.storage.setItem(this.key, JSON.stringify(geter())); });
    }
    getObj() {
        if (this.obj)
            return this.obj;
    }
    delObj() {
        this.obj = ({});
    }
    setObj(obj) {
        this.obj = obj;
    }
}

class ListRecipesButton {
    constructor(element) {
        this.btn = element;
        if (this.btn.id !== "currentPage") {
            this.btn.onclick = ev => {
                this.onclick(parseInt(this.btn.textContent));
            };
        }
    }
}
class ListRecipes {
    setList(html, searcher) {
        while (this.headNode.hasChildNodes())
            this.headNode.removeChild(this.headNode.firstChild);
        this.headNode.insertAdjacentHTML("beforeend", html);
        this.headNode.querySelectorAll(".page").forEach((btn) => {
            new ListRecipesButton(btn).onclick = (page) => {
                searcher.search(page);
            };
        });
        this.headNode.querySelectorAll("article.recipe-preview").forEach((recipe) => {
            let id = parseInt(recipe.id.substr(1));
            new FavoriteMarkView(recipe.querySelector("section > header > img"), this.favors.has(id))
                .onChangeMode = (m) => {
                console.log(m + " " + id);
                if (m)
                    this.favors.add(id);
                else
                    this.favors.delete(id);
            };
        });
        //TODO так как теперь вместо img используется div с фоновым изображением, мы потеряли событие error
        /*this.headNode.querySelectorAll(".recipe_avatar").forEach((div: HTMLDivElement) => {
            div.addEventListener("error",
                () => {
                    div.style.backgroundImage = "url(../images/default.png)";
                });
        });*/
    }
    constructor(node, favors) {
        this.headNode = node;
        this.favors = favors;
    }
}
class FavoriteMarkView {
    constructor(node, mode = false) {
        this.img = node;
        this.setMode(mode);
        this.img.onclick = () => {
            this.setMode(!this.mode);
        };
    }
    setMode(mode) {
        this.mode = mode;
        if (mode)
            this.img.src = "/images/bookmark-active.svg";
        else
            this.img.src = "/images/bookmark-passive.svg";
        if (this.onChangeMode)
            this.onChangeMode(mode);
    }
}
class ListFavoriteRecipes {
    constructor() {
        this.storage = new SetInStorage("favoriteRecipes", false);
        this.ids = this.storage.getList();
    }
    get() {
        return Array.from(this.ids.values());
    }
    add(id) {
        this.ids.add(id);
    }
    delete(id) {
        this.ids.delete(id);
    }
    has(id) {
        return this.ids.has(id);
    }
}

class TimeRecipeModel {
    constructor(days, hours, minutes) {
        this.days = days;
        this.hours = hours;
        this.minutes = minutes;
    }
}
class TimeRecipeView {
    constructor(node) {
        this.days = node.querySelector('[name="days"]');
        this.hours = node.querySelector('[name="hours"]');
        this.minutes = node.querySelector('[name="minutes"]');
    }
    getTime() {
        return new TimeRecipeModel(this.days.valueAsNumber, this.hours.valueAsNumber, this.minutes.valueAsNumber);
    }
    setTime(time) {
        if (time) {
            this.days.value = String(time.days);
            this.hours.value = String(time.hours);
            this.minutes.value = String(time.minutes);
        }
        else {
            this.days.value = "0";
            this.hours.value = "0";
            this.minutes.value = null;
        }
    }
}
class RecipeModel {
}
class RecipePartialView {
    constructor(form) {
        this.name = document.getElementById("Name");
        this.description = document.getElementById("Description");
        this.instruction = document.getElementById("Instruction");
        this.image = document.getElementById("Image");
        const img = new ImageView(document.getElementById("ImageOut"));
        this.image.addEventListener("change", (ev) => {
            img.setLink(this.image.value);
        });
        let uploader = new ImageUploader(this.image, (link) => {
            this.image.value = link;
            img.setLink(link);
        });
    }
    set(model) {
        if (model) {
            this.name.value = model.name ? model.name : null;
            this.description.value = model.description ? model.description : null;
            ;
            this.instruction.value = model.instruction ? model.instruction : null;
            ;
            this.image.value = model.image ? model.image : null;
            ;
        }
    }
}
class RecipeCreateView {
    constructor(form, inventory) {
        this.cookingTime = new TimeRecipeView(form.querySelector('[name="time"]'));
        this.ingredients = inventory;
        this.main = new RecipePartialView(form);
        this.storage = new ObjectInStorage("creatingRecipe", true, () => { return this.getModel(); });
        this.setModel(this.storage.getObj());
    }
    getModelWithOutIngredients() {
        let recipe = this.storage.getObj();
        for (let field in this.main) {
            recipe[field.toString()] = this.main[field.toString()].value;
        }
        recipe.cookingTime = this.cookingTime.getTime();
        return recipe;
    }
    getModel() {
        let recipe = this.getModelWithOutIngredients();
        recipe.ingredients = this.ingredients.getIngredients();
        return recipe;
    }
    cleanModel() {
        this.setModel(new RecipeModel());
        this.ingredients.delIngredients();
    }
    setModel(model) {
        this.cookingTime.setTime(model.cookingTime);
        this.main.set(model);
    }
}
class RecipeCreateController {
    constructor(form, inventory) {
        this.view = new RecipeCreateView(form, inventory);
        this.error = new ErrorView(form);
        form.onsubmit = () => {
            try {
                let recipe = this.view.getModel();
                let createRequest = new XMLHttpRequest();
                createRequest.onload = () => {
                    let msg = JSON.parse(createRequest.response);
                    if (msg["link"]) {
                        this.view.cleanModel();
                        location.href = msg["link"];
                    }
                    this.setError(msg.message);
                };
                createRequest.open("POST", "/Recipes/Create", true);
                createRequest.setRequestHeader("Content-Type", "application/json");
                createRequest.send(JSON.stringify(recipe));
            }
            catch (err) {
                console.log(err);
            }
            return false;
        };
    }
    setError(message) {
        this.error.display(message);
    }
}

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
