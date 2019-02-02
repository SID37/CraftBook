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
                if (mod === "one" && data.files.length > 1) {
                    error.display(true, "Здесь можно загрузить только один файл!");
                    return false;
                }
                console.group("files");
                let boundary = String(Math.random()).slice(2);
                let boundaryMiddle = '--' + boundary + '\r\n';
                let boundaryLast = '--' + boundary + '--\r\n';
                for (let i = 0; i < data.files.length; i++) {
                    let file = data.files[i];
                    if (file.type.match(/image/)) {
                        let uploadRequest = new XMLHttpRequest();
                        console.log(`Отловили файл ${file.name}`);
                        uploadRequest.onloadend = () => {
                            let message = JSON.parse(uploadRequest.response);
                            if (uploadRequest.status > 300) {
                                //TODO как-то сообщить пользователю
                                error.display(true, `Не удалось загрузить картинку. Ошибка ${uploadRequest.status}.`);
                                return;
                            }

                            if (message.message) {
                                error.display(true, message.message);
                                return;
                            }
                            uploaded(message.link);
                        }
                        uploadRequest.open("POST", "/Images/Create", true);
                        uploadRequest.setRequestHeader("Content-Type", `multipart/form-data; boundary=${boundary}` + boundary);
                        //uploadRequest.send(`\r\nContent-Disposition: form-data; name="image"\r\n\r\n"${file}"` + boundaryLast);
                        uploadRequest.send(file);
                    }
                }
                console.groupEnd();
                return false;
            }
            return false;
        };
    }
}