var ImageUploader = /** @class */ (function () {
    function ImageUploader(node, uploaded, mod) {
        if (mod === void 0) { mod = "one"; }
        var error = new ErrorView(node);
        node.ondrop = function (ev) {
            var data = ev.dataTransfer;
            if (data) {
                if (data.files.length > 0) {
                    ev.preventDefault();
                    if (data.files.length > 1 && mod === "one") {
                        error.display("Здесь можно загрузить только один файл!");
                        return;
                    }
                }
                console.group("files");
                var _loop_1 = function (i) {
                    var file = data.files[i];
                    if (file.type.match(/image/)) {
                        var uploadRequest_1 = new XMLHttpRequest();
                        console.log("\u041E\u0442\u043B\u043E\u0432\u0438\u043B\u0438 \u0444\u0430\u0439\u043B " + file.name);
                        uploadRequest_1.onloadend = function () {
                            error.display(false);
                            if (uploadRequest_1.status > 300) {
                                //TODO как-то сообщить пользователю
                                error.display("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0443. \u041E\u0448\u0438\u0431\u043A\u0430 " + uploadRequest_1.status + ".");
                                return;
                            }
                            var message = JSON.parse(uploadRequest_1.response);
                            if (message.message) {
                                error.display(message.message);
                                return;
                            }
                            uploaded(message.link);
                        };
                        uploadRequest_1.open("POST", "/Images/Create", true);
                        var formData = new FormData();
                        formData.append("image", file);
                        uploadRequest_1.send(formData);
                    }
                };
                for (var i = 0; i < data.files.length; i++) {
                    _loop_1(i);
                }
                console.groupEnd();
            }
        };
    }
    return ImageUploader;
}());
var ImageView = /** @class */ (function () {
    function ImageView(imgNode, link) {
        this.img = imgNode;
        if (link)
            this.setLink(link);
    }
    ImageView.prototype.setLink = function (link) {
        this.img.src = link;
    };
    return ImageView;
}());
