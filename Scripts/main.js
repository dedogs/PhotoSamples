function appendImages(src, width, height, horizontalSpace, handler) {
    var image,
        def = {},
        fragment = document.createDocumentFragment(),
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
                o = JSON.parse(src[index].substring(position, src[index].length));

            o.Dimensions.Width = dimension.width;
            o.Dimensions.Height = dimension.height;

            return JSON.stringify(o);
        };

    if (def["appendImages"]) {
        return def["appendImages"].promise();
    }

    handler = handler ? handler : "/api/thumbImage?p=";
    def["appendImages"] = $.Deferred();
    i = 0;
    (function imageLoad() {
        var _div;
        if (src[i]) {
            image = document.createElement('img');
            src[i] = handler + setDimensions(i, dimensions.inital);
            image.src = src[i];
            image.onload = function () {
                dimensions.width = this.width;
                dimensions.height = this.height;

                div = document.createElement("div");
                div.setAttribute("class", "img-content");

                _div = $(div);

                _div.width(dimensions.width);

                horizontalSpace ? dimensions.inital.width > dimensions.width ? _div.width(dimensions.inital.width) : _div.width(dimensions.width) : _div.width(dimensions.width);


                dimensions.inital.height > dimensions.height ? _div.height(dimensions.inital.height) : _div.height(dimensions.height);

                src[i] = setDimensions(i, dimensions);
                div.setAttribute("data-src", src[i]);
                src[i] += handler;

                div.appendChild(image);
                fragment.appendChild(div);

                i++;
                imageLoad();
            }
        } else {
            div = document.createElement("div");
            div.setAttribute("class", "break-all");
            div.innerHTML = "&nbsp;";
            fragment.appendChild(div);

            def["appendImages"].resolve(fragment);
            delete def["appendImages"];
        }
    }())

    return def["appendImages"].promise();
}

$(function () {
    var width = 400,
        height = 312;

    //Returns a DOM fragment
    appendImages(preLoadedImages(), width, height, false).done(function (fragment) {
        $("section").html(fragment);
    });

    var button = document.getElementById("increase");
    button.onclick = function () {
        width += 100;
        height += 100;
        appendImages(preLoadedImages(), width, height, false).done(function (fragment) {
            $("section").html(fragment);
        });
    };
})