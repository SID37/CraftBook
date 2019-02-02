var eventDebug;

type UploadMod = "one" | "many";
type UploadListener = (link: string) => void;
class ImageUploader {
    constructor(node: HTMLElement, uploaded: UploadListener, mod: UploadMod = "one") {
        let error = new ErrorView(node);
        node.ondrop = (ev: DragEvent) => {
            const data = ev.dataTransfer;
            if (data) {
                if (mod === "one" && data.files.length > 1) {
                    error.display("Здесь можно загрузить только один файл!");
                    return false;
                }
                console.group("files");
                for (let i = 0; i < data.files.length; i++) {
                    let file = data.files[i];
                    if (file.type.match(/image/)) {
                        let uploadRequest = new XMLHttpRequest();
                        console.log(`Отловили файл ${file.name}`);
                        uploadRequest.onloadend = () => {
                            error.display(false);
                            if (uploadRequest.status > 300) {
                                //TODO как-то сообщить пользователю
                                error.display(`Не удалось отправить картинку. Ошибка ${uploadRequest.status}.`);
                                return;
                            }
                            let message = JSON.parse(uploadRequest.response);
                            if (message.message) {
                                error.display(message.message);
                                return;
                            }
                            uploaded(message.link);
                        }
                        uploadRequest.open("POST", "/Images/Create", true);
                        let formData = new FormData();
                        formData.append("image", file);
                        uploadRequest.send(formData);
                    }
                }
                console.groupEnd();
                return false;
            }
            return false;
        };
    }
}