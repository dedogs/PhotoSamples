function appendImages(images, width, height, horizontalSpace, mask, handler) {
    var image,
        def = {},
        fragment,
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
    def["appendImages"] = $.Deferred();
    i = 0;
    (function imageLoad() {
        var div,
            _mask;

        console.log(i);
        if (images[i]) {
            images[i] = handler + setDimensions(i, dimensions.inital);
            image = $("<img>").attr("src",images[i]).on("load", function () {
                dimensions.width = this.width;
                dimensions.height = this.height;

                div = $("<div>").attr("class", "img-content");

                horizontalSpace ? dimensions.inital.width > dimensions.width ? div.width(dimensions.inital.width) : div.width(dimensions.width) : div.width(dimensions.width);

                dimensions.inital.height > dimensions.height ? div.height(dimensions.inital.height) : div.height(dimensions.height);

                images[i] = setDimensions(i, dimensions);
                div.data("src", images[i]);
                images[i] += handler;

                div.append(image);

                if (mask) {
                    _mask = $(mask());
                    _mask.width(div.width());

                    _mask.appendTo(div);
                }

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

$(function () {
    var width = 400,
        height = 312,
        mask =  function () {
            var div = document.createElement("div"),
                innerDiv = document.createElement("div");
            div.setAttribute("class", "mask");
            
            div.appendChild(innerDiv);

            return div;
        };

    //Returns a DOM fragment
    appendImages(preLoadedImages(), width, height, false, null).done(function (fragment) {
        var section = $("section");
        section.html("");
        section.append(fragment);
    });
})