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
}

class RecipeModel {
    name: string;
    description: string;
    instruction: string;
    image: string;
    cookingTime: TimeRecipeModel;
    ingredients: Array<IngredientModel>;
}

class RecipeCreateView {
    private name: HTMLInputElement;
    private description: HTMLInputElement;
    private instruction: HTMLInputElement;
    private image: HTMLInputElement;
    private cookingTime: TimeRecipeView;
    private ingredients: Inventory;
    private error: ErrorView;
    

    constructor(form: HTMLFormElement, inventory: Inventory, listener: (r: RecipeModel) => void) {
        this.name = document.getElementById("Name") as HTMLInputElement;
        this.description = document.getElementById("Description") as HTMLInputElement;
        this.instruction = document.getElementById("Instruction") as HTMLInputElement;
        this.image = document.getElementById("Image") as HTMLInputElement;
        const img = new ImageView(document.getElementById("ImageOut") as HTMLImageElement);
        this.error = new ErrorView(form);
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
        this.cookingTime = new TimeRecipeView(form.querySelector<HTMLElement>('[name="time"]'));
        this.ingredients = inventory;
        form.onsubmit = () => {
            try {
                let recipe = new RecipeModel();
                for (let field in this) {
                    if (field == "ingredients") {
                        recipe.ingredients = this.ingredients.getIngredients();
                        console.debug(this.ingredients.getIngredients());
                    } else if (field == "cookingTime") {
                        recipe.cookingTime = this.cookingTime.getTime();
                    } else if (field != "error" && field != "setError") {
                        recipe[field.toString()] = (this[field.toString()] as HTMLInputElement).value;
                    }
                }
                listener(recipe);
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

