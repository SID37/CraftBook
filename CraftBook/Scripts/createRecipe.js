{
    var inventory = new Inventory(true);
    var rV_1 = new RecipeCreateView(document.querySelector('form[action="/Recipes/Create"]'), inventory, function (recipe) {
        var createRequest = new XMLHttpRequest();
        createRequest.onload = function () {
            var msg = JSON.parse(createRequest.response);
            if (msg["link"]) {
                location.href = msg["link"];
            }
            rV_1.setError(msg.message);
        };
        createRequest.open("POST", "/Recipes/Create", true);
        createRequest.setRequestHeader("Content-Type", "application/json");
        createRequest.send(JSON.stringify(recipe));
    });
}
