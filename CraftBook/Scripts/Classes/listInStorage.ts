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