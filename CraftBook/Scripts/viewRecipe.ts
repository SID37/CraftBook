{
    let inventory = new Inventory();

    (document.querySelector('input[name="find_recept_by_ingr"]') as HTMLElement).onclick = () => location.href = "/";

    document.getElementById("bookmark").onclick = () => location.href = "/";
}
