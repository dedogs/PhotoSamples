var ImageDisplay = function () {
    //On each continer append addition elments.
    var appendOnEach,
        onEach = (function () {
                var methods = [];
                appendOnEach = function (element) {
                    for (var i = 0; i < methods.length; i++) {
                        methods[i](element);
                    }
                };
                return {
                    add: function (fn) {
                        methods[methods.length] = fn;
                    }
                }
    }()),
    append = function(images, width, height, horizontalSpace, handler) {
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

                    appendOnEach(div);

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

    return {
        onEach: onEach,
        append: append
    };
}

$(function () {
    var width = 400,
        height = 312,
        mask = function (element) {
            div = $("<div>").attr("class", "mask");
            innerDiv = $("<div>");

            div.append(innerDiv);

            return element.append(div);
        };

    var o = ImageDisplay();

    //Appends additionial layers/behaviors on top image container.
    o.onEach.add(mask);
    o.append(preLoadedImages(), width, height, false).done(function (fragment) {
        var section = $("section");
        section.html("").append(fragment);
    });
})