class RecipeModel {
    name: string;
    description: string;
    instruction: string;
    image: string;
    cookingTime: string;
    ingredients: Array<IngredientModel>;
}

class RecipeCreateView {
    name: HTMLInputElement;
    description: HTMLInputElement;
    instruction: HTMLInputElement;
    image: HTMLInputElement;
    cookingTime: HTMLInputElement;
    ingredients: Inventory;

    

    constructor(form: HTMLFormElement, inventory: Inventory, listener: (r: RecipeModel) => void) {
        this.name = document.getElementById("Name") as HTMLInputElement;
        this.description = document.getElementById("Description") as HTMLInputElement;
        this.instruction = document.getElementById("Instruction") as HTMLInputElement;
        this.image = document.getElementById("Image") as HTMLInputElement;
        let up = new ImageUploader(this.image, (link: string) => {
            console.log(link);
        });
        //this.cookingTime = document.getElementById("Name") as HTMLInputElement;
        this.ingredients = inventory;
        form.onsubmit = () => {
            try {
                let recipe = new RecipeModel();
                for (let field in this) {
                    if (field == "ingredients") {
                        recipe[field.toString()] = this.ingredients.getIngredients();
                    } else {
                        recipe[field.toString()] = (this[field.toString()] as HTMLInputElement).value;
                    }
                }
                recipe.cookingTime = "42";
                console.log(recipe);
                listener(recipe);
            } catch (err) {
                console.log(err);
            }
            return false;
        }
    }
}

