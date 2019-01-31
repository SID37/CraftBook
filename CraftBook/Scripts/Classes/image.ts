var eventDebug;

type UploadMod = "one" | "many";
type UploadListener = (link: string) => void;
class ImageUploader {
    constructor(node: HTMLElement, uploaded: UploadListener, mod: UploadMod = "one") {
        let error = new ErrorView(node);
        node.ondrop = (ev: DragEvent) => {
            const data = ev.dataTransfer;
            {
                console.group();
                const a = ev.dataTransfer;
                a.clearData('text/html');
                for (var v in a) {
                    console.log(`${v}:`);
                    console.log(a[v]);
                }
                console.groupEnd();
                console.group();
                for (let i = 0; i < a.items.length; ++i) {
                    console.log(a.items[i]);
                    console.group();
                    for (var v in a.items[i]) {
                        console.log(`${v}:`);
                        console.log(a.items[i][v]);
                    }
                    console.groupEnd();
                }
                console.groupEnd();
                //console.log(a.getData());
            }
            if (data) {
                if (mod === "one" && data.items.length > 1) {
                    error.display(true, "Здесь можно загрузить только один файл!");
                    return false;
                }
                for (let  i = 0; i < data.items.length; i++) {
                    let item = data.items.item(i);
                }
                let uploadRequest = new XMLHttpRequest();
                return false;
            }
            return false;
        };
    }
}