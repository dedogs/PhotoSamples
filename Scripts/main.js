function appendImages(src, width, height, horizontalSpace) {
    var image,
        def = $.Deferred(),
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
            var position = "/api/thumbImage?p=".length,
                handler = src[index].substring(0, position),
                o = JSON.parse(src[index].substring(position, src[index].length));

            o.Dimensions.Width = dimension.width;
            o.Dimensions.Height = dimension.height;

            return handler + JSON.stringify(o);
        };

    i = 0;
    (function imageLoad() {
        var _div;
        if (src[i]) {
            image = document.createElement('img');
            src[i] = setDimensions(i, dimensions.inital);
            image.src = src[i];
            image.onload = function () {
                dimensions.width = this.width;
                dimensions.height = this.height;

                div = document.createElement("div");
                div.setAttribute("class", "img-content");
                src[i] = setDimensions(i, dimensions);

                _div = $(div);

                _div.width(dimensions.width);

                horizontalSpace ? dimensions.inital.width > dimensions.width ? _div.width(dimensions.inital.width) : _div.width(dimensions.width) : _div.width(dimensions.width);
                

                dimensions.inital.height > dimensions.height ? _div.height(dimensions.inital.height) : _div.height(dimensions.height);

                div.setAttribute("data-src", src[i]);
                div.appendChild(image);
                fragment.appendChild(div);

                console.log(i);
                i++;
                imageLoad();
            }
        } else {
            div = document.createElement("div");
            div.setAttribute("class", "break-all");
            div.innerHTML = "&nbsp;";
            fragment.appendChild(div);

            return def.resolve(fragment);
        }
    }())

    return def.promise();
}