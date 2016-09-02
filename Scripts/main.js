var ImageDisplay = function () {
    //On each continer append addition elments.
    var appendOnEach,
        methods = [];

    if (!(this instanceof ImageDisplay)) {
        return new ImageDisplay();
    }

    this.onEach = function (fn) {
        appendOnEach = function (element, img) {
            for (var i = 0; i < methods.length; i++) {
                element = methods[i](element, img);
            }
        };

        methods[methods.length] = fn;

        return this;
    };

    this.append = function (images, width, height, horizontalSpace, handler) {
        var image,
            def = {},
            fragment,
            ins,
            ofNumber,
            dimensions = {
                inital: {
                    width: width,
                    height: height
                },
                width: 0,
                height: 0
            },
            div,
            i = 0,
            setDimensions = function (index, dimension) {
                var position = handler.length,
                    o = JSON.parse(images[index].substring(position, images[index].length));

                o.Dimensions.Width = dimension.width;
                o.Dimensions.Height = dimension.height;

                return JSON.stringify(o);
            };

        //Allow only one call. Initial call must complete.
        if (def["appendImages"]) {
            return def["appendImages"].promise();
        }

        fragment = $(document.createDocumentFragment());
        handler = handler ? handler : "/api/thumbImage?p=";
        ins = $(".spinner-wrapper ins");
        ofNumber = " of " + images.length;
        def["appendImages"] = $.Deferred();
        i = 0;
        (function imageLoad() {
            var div,
                _mask;

            ins.text(i + 1 + ofNumber);

            console.log(i);
            if (images[i]) {
                images[i] = handler + setDimensions(i, dimensions.inital);
                image = $("<img>").attr("src", images[i]).on("load", function () {

                    dimensions.width = this.width;
                    dimensions.height = this.height;

                    div = $("<div>").attr("class", "img-content");

                    horizontalSpace ? dimensions.inital.width > dimensions.width ? div.width(dimensions.inital.width) : div.width(dimensions.width) : div.width(dimensions.width);

                    dimensions.inital.height > dimensions.height ? div.height(dimensions.inital.height) : div.height(dimensions.height);

                    images[i] = setDimensions(i, dimensions);
                    div.data("src", images[i]);
                    images[i] += handler;

                    div.append(image);

                    appendOnEach(div, image);

                    fragment.append(div);

                    i++;
                    imageLoad();
                })
            } else {
                fragment.append($("<div>").attr("class", "break-all").html("&nbsp;"));

                def["appendImages"].resolve(fragment);
                delete def["appendImages"];
            }
        }())

        return def["appendImages"].promise();
    }
}

$(function () {
    var width = 400,
        height = 312,
        mask = function (element, img) {
            div = $("<div>").attr("class", "mask");
            innerDiv = $("<div>");

            div.append(innerDiv);

            element.append(div);

            return element;
        },
        click = function (element, img) {
            element.on("click", function () {
                console.log("Image width: " + img.width() + " >> Image height: " + img.height());
            })

            return element;
        };

    var o = ImageDisplay();

    //Appends additionial layers/behaviors on top image container.
    o.onEach(mask).onEach(click);
    o.append(preLoadedImages(), width, height, false).done(function (fragment) {
        var section = $("section");
        section.html("").append(fragment);
    });
})