class TimeRecipeModel  {
    minutes: number;
    hours: number;
    days: number;

    constructor(days: number, hours: number, minutes: number) {
        this.days = days;
        this.hours = hours;
        this.minutes = minutes;
    }
}

class TimeRecipeView {
    private minutes: HTMLInputElement;
    private hours:   HTMLInputElement;
    private days:    HTMLInputElement;
    constructor(node: HTMLElement) {
        this.days = node.querySelector('[name="days"]') as HTMLInputElement;
        this.hours = node.querySelector('[name="hours"]') as HTMLInputElement;
        this.minutes = node.querySelector('[name="minutes"]') as HTMLInputElement;
    }
    getTime(): TimeRecipeModel {
        return new TimeRecipeModel(this.days.valueAsNumber, this.hours.valueAsNumber, this.minutes.valueAsNumber);
    }
    setTime(time: TimeRecipeModel) {
        if (time) {
            this.days.value = String(time.days);
            this.hours.value = String(time.hours);
            this.minutes.value = String(time.minutes);
        } else {
            this.days.value = "0";
            this.hours.value = "0";
            this.minutes.value = null;
        }
    }
}

class RecipeModel {
    name: string;
    description: string;
    instruction: string;
    image: string;
    cookingTime: TimeRecipeModel;
    ingredients: Array<IngredientModel>;
}

class RecipePartialView {
    name: HTMLInputElement;
    description: HTMLInputElement;
    instruction: HTMLInputElement;
    image: HTMLInputElement;

    constructor(form: HTMLFormElement) {
        this.name = document.getElementById("Name") as HTMLInputElement;
        this.description = document.getElementById("Description") as HTMLInputElement;
        this.instruction = document.getElementById("Instruction") as HTMLInputElement;
        this.image = document.getElementById("Image") as HTMLInputElement;
        const img = new ImageView(document.getElementById("ImageOut") as HTMLImageElement);
        this.image.addEventListener("change", (ev: Event) => {
            img.setLink(this.image.value);
        });
        let uploader = new ImageUploader(
            this.image,
            (link: string) => {
                this.image.value = link;
                img.setLink(link);
            }
        );
    }

    set(model: RecipeModel) {
        if (model) {
            this.name.value = model.name ? model.name : null;
            this.description.value = model.description ? model.description : null;;
            this.instruction.value = model.instruction ? model.instruction : null;;
            this.image.value = model.image ? model.image : null;;
        }
    }
}

class RecipeCreateView {
    private main: RecipePartialView;
    private cookingTime: TimeRecipeView;
    private ingredients: Inventory;
    private storage: ObjectInStorage<RecipeModel>;

    constructor(form: HTMLFormElement, inventory: Inventory) {
        this.cookingTime = new TimeRecipeView(form.querySelector<HTMLElement>('[class="time"]'));
        this.ingredients = inventory;
        this.main = new RecipePartialView(form);
        this.storage = new ObjectInStorage<RecipeModel>("creatingRecipe", true, () => {return this.getModel()});
        this.setModel(this.storage.getObj());
    }

    private getModelWithOutIngredients() {
        let recipe = this.storage.getObj();
        for (let field in this.main) {
            recipe[field.toString()] = (this.main[field.toString()] as HTMLInputElement).value;
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

    private setModel(model: RecipeModel) {
        this.cookingTime.setTime(model.cookingTime);
        this.main.set(model);
    }
}

class RecipeCreateController {
    private view: RecipeCreateView;
    private error: ErrorView;

    constructor(form: HTMLFormElement, inventory: Inventory) {
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
            } catch (err) {
                console.log(err);
            }
            return false;
        }
    }
    
    setError(message: string): void {
        this.error.display(message);
    }
}

