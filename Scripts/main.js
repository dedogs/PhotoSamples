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

    fragment = document.createDocumentFragment();
    handler = handler ? handler : "/api/thumbImage?p=";
    def["appendImages"] = $.Deferred();
    i = 0;
    (function imageLoad() {
        var _div,
            _mask;

        if (images[i]) {
            image = document.createElement('img');
            images[i] = handler + setDimensions(i, dimensions.inital);
            image.src = images[i];
            image.onload = function () {
                dimensions.width = this.width;
                dimensions.height = this.height;

                div = document.createElement("div");
                div.setAttribute("class", "img-content");

                _div = $(div);

                horizontalSpace ? dimensions.inital.width > dimensions.width ? _div.width(dimensions.inital.width) : _div.width(dimensions.width) : _div.width(dimensions.width);

                dimensions.inital.height > dimensions.height ? _div.height(dimensions.inital.height) : _div.height(dimensions.height);

                images[i] = setDimensions(i, dimensions);
                div.setAttribute("data-src", images[i]);
                images[i] += handler;

                div.appendChild(image);

                if (mask) {
                    _mask = $(mask());
                    _mask.width(_div.width());

                    _mask.appendTo(div);
                }

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
        $("section").html(fragment);
    });
})