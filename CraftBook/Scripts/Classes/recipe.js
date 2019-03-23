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
}
class RecipeModel {
}
class RecipeCreateView {
    constructor(form, inventory, listener) {
        this.name = document.getElementById("Name");
        this.description = document.getElementById("Description");
        this.instruction = document.getElementById("Instruction");
        this.image = document.getElementById("Image");
        const img = new ImageView(document.getElementById("ImageOut"));
        this.error = new ErrorView(form);
        this.image.addEventListener("change", (ev) => {
            img.setLink(this.image.value);
        });
        let uploader = new ImageUploader(this.image, (link) => {
            this.image.value = link;
            img.setLink(link);
        });
        this.cookingTime = new TimeRecipeView(form.querySelector('[name="time"]'));
        this.ingredients = inventory;
        form.onsubmit = () => {
            try {
                let recipe = new RecipeModel();
                for (let field in this) {
                    if (field == "ingredients") {
                        recipe.ingredients = this.ingredients.getIngredients();
                        console.debug(this.ingredients.getIngredients());
                    }
                    else if (field == "cookingTime") {
                        recipe.cookingTime = this.cookingTime.getTime();
                    }
                    else if (field != "error" && field != "setError") {
                        recipe[field.toString()] = this[field.toString()].value;
                    }
                }
                listener(recipe);
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
