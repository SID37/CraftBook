{
    let inventory = new Inventory(true);
    let rV = new RecipeCreateView(document.querySelector('form[action="/Recipes/Create"]') as HTMLFormElement, inventory,
        (recipe: RecipeModel) => {
            let createRequest = new XMLHttpRequest();
            createRequest.onload = () => {
                document.body.insertAdjacentHTML("afterbegin", createRequest.response);
            };
            createRequest.open("POST", "/Recipes/Create", true);
            createRequest.setRequestHeader("Content-Type", "application/json");
            createRequest.send(JSON.stringify(recipe));
        }
    );

}