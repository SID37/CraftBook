class ListInStorage<T> {
    constructor(name: string, temporary: boolean) {
        this.key = name;
        this.storage = temporary ? sessionStorage : localStorage;
        this.list = JSON.parse(this.storage.getItem(this.key)) as Array<T>;
        if (this.list == null)
            this.list = new Array<T>();
        window.addEventListener("unload", () => { this.storage.setItem(this.key, JSON.stringify(this.list)); });
    }
    private key: string;
    private storage: Storage;
    private list: Array<T>;

    getList(): Array<T> {
        return this.list;
    }

    setList(list: Array<T>) {
        this.list = list;
    }
}

class SetInStorage<T> {
    constructor(name: string, temporary: boolean) {
        this.key = name;
        this.storage = temporary ? sessionStorage : localStorage;
        let list = JSON.parse(this.storage.getItem(this.key)) as Array<T>;
        this.list = new Set<T>(list);
        window.addEventListener("unload", () => { this.storage.setItem(this.key, JSON.stringify(Array.from(this.list.values()))); });
    }
    private key: string;
    private storage: Storage;
    private list: Set<T>;

    getList(): Set<T> {
        return this.list;
    }

    setList(list: Set<T>) {
        this.list = list;
    }
}

class ObjectInStorage<T> {
    constructor(name: string, temporary: boolean, geter: ()=>T) {
        this.key = name;
        this.storage = temporary ? sessionStorage : localStorage;
        this.obj = JSON.parse(this.storage.getItem(this.key)) as T;
        if (this.obj == null) {
            this.obj =  ({}) as T;
        }
        window.addEventListener("unload", () => { this.storage.setItem(this.key, JSON.stringify(geter())); });
    }
    private key: string;
    private storage: Storage;
    private obj: T;

    getObj() : T {
        if(this.obj)
            return this.obj;
    }

    delObj() {
        this.obj = ({}) as T;
    }

    setObj(obj: T) {
        this.obj = obj;
    }
}