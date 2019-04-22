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
        this.cookingTime = new TimeRecipeView(form.querySelector('[class="time"]'));
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
