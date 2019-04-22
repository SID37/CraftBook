class IntgredientCreator {
    constructor(form, listener) {
        this.form = form;
        this.name = form.querySelector('input[type="text"]');
        this.unitId = form.querySelector('select');
        this.form.onsubmit = () => {
            try {
                let createRequest = new XMLHttpRequest();
                createRequest.onload = () => {
                    let msg = JSON.parse(createRequest.response);
                    if (!msg.message) {
                        listener(msg);
                    }
                    else {
                        this.setError(msg.message);
                    }
                };
                let request = {
                    name: this.name.value,
                    unitId: this.unitId.value
                };
                createRequest.open("POST", "/Ingredients/Create", true);
                createRequest.setRequestHeader("Content-Type", "application/json");
                createRequest.send(JSON.stringify(request));
            }
            catch (e) {
                console.log(e);
            }
            return false;
        };
    }
    setError(msg) {
        alert(msg);
    }
}
{
    let form = document.querySelector("form.create-ingredient");
    let inventory = new Inventory(true);
    new IntgredientCreator(form, (m) => {
        inventory.setInAddator(m);
    });
}
