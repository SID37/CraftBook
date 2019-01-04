
/*AJAX запрос на address
function Request(address) {
    this.__proto__ = new XMLHttpRequest();
    open("POST", address, true);
    setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
}*/

class Inventory {
    //requestAdd: XMLHttpRequest;
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
        this.form = document.querySelector("article.inventory form.create-ingredient") as HTMLFormElement;
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