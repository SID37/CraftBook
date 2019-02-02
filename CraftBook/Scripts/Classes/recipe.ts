class RecipeModel {
    name: string;
    description: string;
    instruction: string;
    image: string;
    cookingTime: string;
    ingredients: Array<IngredientModel>;
}

class RecipeCreateView {
    private name: HTMLInputElement;
    private description: HTMLInputElement;
    private instruction: HTMLInputElement;
    private image: HTMLInputElement;
    private cookingTime: HTMLInputElement;
    private ingredients: Inventory;

    

    constructor(form: HTMLFormElement, inventory: Inventory, listener: (r: RecipeModel) => void) {
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

