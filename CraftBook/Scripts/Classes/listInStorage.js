class ListInStorage {
    constructor(name, temporary) {
        this.key = name;
        this.storage = temporary ? sessionStorage : localStorage;
        this.list = JSON.parse(this.storage.getItem(this.key));
        if (this.list == null)
            this.list = new Array();
        window.addEventListener("unload", () => { this.storage.setItem(this.key, JSON.stringify(this.list)); });
    }
    getList() {
        return this.list;
    }
    setList(list) {
        this.list = list;
    }
}
class SetInStorage {
    constructor(name, temporary) {
        this.key = name;
        this.storage = temporary ? sessionStorage : localStorage;
        let list = JSON.parse(this.storage.getItem(this.key));
        this.list = new Set(list);
        window.addEventListener("unload", () => { this.storage.setItem(this.key, JSON.stringify(Array.from(this.list.values()))); });
    }
    getList() {
        return this.list;
    }
    setList(list) {
        this.list = list;
    }
}
