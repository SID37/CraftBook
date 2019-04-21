
class IntgredientCreator {
    private form: HTMLFormElement;
    private name: HTMLInputElement;
    private unitId: HTMLSelectElement;
    constructor(form: HTMLFormElement, listener: (partialModel: IngredientModel)=>void) {
        this.form = form;
        this.name = form.querySelector('input[type="text"]') as HTMLInputElement;
        this.unitId = form.querySelector('select') as HTMLSelectElement;
        this.form.onsubmit = () => {
            try {
                let createRequest = new XMLHttpRequest();
                createRequest.onload = () => {
                    let msg = JSON.parse(createRequest.response);
                    if (!msg.message) {
                        listener(msg);
                    } else {
                        this.setError(msg.message);
                    }
                };
                let request = {
                    name: this.name.value,
                    unitId: this.unitId.value
                }
                createRequest.open("POST", "/Ingredients/Create", true);
                createRequest.setRequestHeader("Content-Type", "application/json");
                createRequest.send(JSON.stringify(request));
            }
            catch (e) {
                console.log(e);
            }
            return false;
        }
    }

    setError(msg) {
        alert(msg);
    }
}

{
    let form = document.querySelector("form.create-ingredient") as HTMLFormElement;
    let inventory = new Inventory(true);
    new IntgredientCreator(form, (m) => {
        inventory.setInAddator(m);
    });
}
