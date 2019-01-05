

class IngredientSoul {
    volume: number;
    id: number;
    name: string;
    unit: string;
}

class IngredientView {
    main: HTMLElement;
    name: HTMLInputElement;
    volume: HTMLInputElement;
    unit: HTMLInputElement;
    constructor() {
        this.main = document.createElement("div") as HTMLElement;
        this.main.classList.add("fieldform");
        this.main.innerHTML = '<div class="in-frame">' +
            '<input type="text" name="name" readonly />' +
            '<input type="number" name="volume" readonly />' +
            '<input type="text" name="unit" readonly />' +
            '</div>' +
            '<input type="image" name="del_ingredient" src="/images/close.svg" />';
        (this.main.querySelector("input[type=\"image\"") as HTMLInputElement).onclick = () => {
            this.main.remove();
            return false;
        };
        this.name = this.main.querySelector('input[name="name"]') as HTMLInputElement;
        this.unit = this.main.querySelector('input[name="unit"]') as HTMLInputElement;
        this.volume = this.main.querySelector('input[name="volume"]') as HTMLInputElement;
    }
}

class Ingredient {
    private soul: IngredientSoul;
    view: IngredientView;
    constructor(json: string) {
        this.soul = <IngredientSoul>JSON.parse(json);
        this.view = new IngredientView();
        this.view.name.value = this.soul.name;
        this.view.volume.value = this.soul.volume.toString();
        this.view.unit.value = this.soul.unit;
    }
    
}

class Inventory {
    inputNameIngr: HTMLInputElement;
    inputButton: HTMLInputElement;
    inputCountIngr: HTMLInputElement;
    inputUIIngr: HTMLInputElement;
    form: HTMLFormElement;
    listIngridients: HTMLElement;


    constructor() {
        this.inputNameIngr = document.querySelector("article.inventory input[type=\"text\"]") as HTMLInputElement;
        this.inputButton = document.getElementById("buttonAddIngridient") as HTMLInputElement;
        this.inputCountIngr = document.querySelector("article.inventory input[type=\"number\"]") as HTMLInputElement;
        this.inputUIIngr =
            document.querySelector("article.inventory input[name=\"ingredient_unit\"]") as HTMLInputElement;
        this.form = document.querySelector("article.inventory form.add-ingredient") as HTMLFormElement;
        this.listIngridients = ((document.querySelector("article.inventory form.list-ingredients")) as HTMLElement);


        //Подсказки при вводе
        this.inputNameIngr.addEventListener("input",
            () => {

                var nameChip = this.inputNameIngr.value;
                console.log(nameChip);
                if (nameChip.length === 0)
                    return;
                if (document.querySelector("option[value=\"" + nameChip + "\""))
                    return;
                var requestSearch = new XMLHttpRequest();
                requestSearch.open("POST", "/Ingredients/Index", true);
                requestSearch.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                requestSearch.onloadend = () => {
                    if (requestSearch.status === 404)
                        return;
                    var tmp = document.querySelector("datalist[id=\"ingredients\"");
                    if (tmp != null)
                        tmp.parentNode.removeChild(tmp);
                    this.form.insertAdjacentHTML("afterend", requestSearch.response);
                }
                requestSearch.send("nameChip=" + encodeURIComponent(nameChip));
            });
        //Окончание ввода названия ингредиента - устанавливаем единицы измерения
        this.inputNameIngr.addEventListener("change",
            () => {
                var nameChip = this.inputNameIngr.value;
                var tmp = document.querySelector("option[value=\"" + nameChip + "\"");
                if (tmp == null) {
                    this.inputUIIngr.value = null;
                    this.inputButton.style.visibility= "hidden";
                } else {
                    this.inputUIIngr.value = tmp.getAttribute("label");
                    this.inputButton.style.visibility = "visible";
                }
            });

        this.form.onsubmit = (event: Event) => {
            try {
                if (this.inputUIIngr.value === "") {
                    return false;
                }
                var requestAdd = new XMLHttpRequest();
                requestAdd.open("POST", "/IngredientQuant/FindName", true);
                requestAdd.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                requestAdd.onloadend = () => {
                    //todo нормально как-то
                    if (requestAdd.status === 404) {
                        alert('ингредиент не найден!');
                        return;
                    }
                    this.listIngridients.insertAdjacentHTML("beforeend", requestAdd.response);
                    const fieldform = this.listIngridients.lastChild as HTMLElement;
                    (fieldform.querySelector("input[type=\"image\"") as HTMLInputElement).onclick = () => {
                        fieldform.remove();
                        return false;
                    };
                    this.inputCountIngr.value = null;
                    this.inputNameIngr.value = null;
                    this.inputUIIngr.value = null;
                };
                const name = this.inputNameIngr.value;
                const count = this.inputCountIngr.value;
                requestAdd.send("ingredientName=" +
                    encodeURIComponent(name) +
                    "&volume=" +
                    encodeURIComponent(count));

            } catch (e) {
                console.log(e.toString());
                return false;
            }
            return false;
        }
    }
}

var inventory = new Inventory();
var ingr1 = new Ingredient('{"volume":1, "name":"test", "unit":"y.e", "id":321}');

for(var i = 0; i<10; i++)
    inventory.listIngridients.appendChild(ingr1.view.main);
