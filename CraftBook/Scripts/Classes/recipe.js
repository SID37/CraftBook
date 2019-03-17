var TimeRecipeModel = /** @class */ (function () {
    function TimeRecipeModel(days, hours, minutes) {
        this.days = days;
        this.hours = hours;
        this.minutes = minutes;
    }
    return TimeRecipeModel;
}());
var TimeRecipeView = /** @class */ (function () {
    function TimeRecipeView(node) {
        this.days = node.querySelector('[name="days"]');
        this.hours = node.querySelector('[name="hours"]');
        this.minutes = node.querySelector('[name="minutes"]');
    }
    TimeRecipeView.prototype.getTime = function () {
        return new TimeRecipeModel(this.days.valueAsNumber, this.hours.valueAsNumber, this.minutes.valueAsNumber);
    };
    return TimeRecipeView;
}());
var RecipeModel = /** @class */ (function () {
    function RecipeModel() {
    }
    return RecipeModel;
}());
var RecipeCreateView = /** @class */ (function () {
    function RecipeCreateView(form, inventory, listener) {
        var _this = this;
        this.name = document.getElementById("Name");
        this.description = document.getElementById("Description");
        this.instruction = document.getElementById("Instruction");
        this.image = document.getElementById("Image");
        var img = new ImageView(document.getElementById("ImageOut"));
        this.error = new ErrorView(form);
        this.image.addEventListener("change", function (ev) {
            img.setLink(_this.image.value);
        });
        var uploader = new ImageUploader(this.image, function (link) {
            _this.image.value = link;
            img.setLink(link);
        });
        this.cookingTime = new TimeRecipeView(form.querySelector('[name="time"]'));
        this.ingredients = inventory;
        form.onsubmit = function () {
            try {
                var recipe = new RecipeModel();
                for (var field in _this) {
                    if (field == "ingredients") {
                        recipe.ingredients = _this.ingredients.getIngredients();
                        console.debug(_this.ingredients.getIngredients());
                    }
                    else if (field == "cookingTime") {
                        recipe.cookingTime = _this.cookingTime.getTime();
                    }
                    else if (field != "error" && field != "setError") {
                        recipe[field.toString()] = _this[field.toString()].value;
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
    RecipeCreateView.prototype.setError = function (message) {
        this.error.display(message);
    };
    return RecipeCreateView;
}());
