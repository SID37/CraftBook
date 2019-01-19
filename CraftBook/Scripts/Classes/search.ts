class SearchString {
    form: HTMLFormElement;
    data: HTMLInputElement;
    onshearch: (searchString: string) => void;

    constructor() {
        this.form = document.querySelector('form[action="/Recipes/SearchByString"') as HTMLFormElement;
        this.data = this.form.querySelector('input[name="searchString"]') as HTMLInputElement;

        this.form.onsubmit = () => {
            const str = this.data.value;
            if (str)
                this.onshearch(str);
            return false;
        }
    }
}