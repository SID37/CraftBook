{
    let inventory = new Inventory(true);
    let rV = new RecipeCreateView(document.querySelector('form[action="/Recipes/Create"]'), inventory, (recipe) => {
        let createRequest = new XMLHttpRequest();
        createRequest.onload = () => {
            let msg = JSON.parse(createRequest.response);
            if (msg["link"]) {
                location.href = msg["link"];
            }
            rV.setError(msg.message);
        };
        createRequest.open("POST", "/Recipes/Create", true);
        createRequest.setRequestHeader("Content-Type", "application/json");
        createRequest.send(JSON.stringify(recipe));
    });
}
