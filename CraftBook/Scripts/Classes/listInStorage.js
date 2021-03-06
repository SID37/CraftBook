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
class ObjectInStorage {
    constructor(name, temporary, geter) {
        this.key = name;
        this.storage = temporary ? sessionStorage : localStorage;
        this.obj = JSON.parse(this.storage.getItem(this.key));
        if (this.obj == null) {
            this.obj = ({});
        }
        window.addEventListener("unload", () => { this.storage.setItem(this.key, JSON.stringify(geter())); });
    }
    getObj() {
        if (this.obj)
            return this.obj;
    }
    delObj() {
        this.obj = ({});
    }
    setObj(obj) {
        this.obj = obj;
    }
}
