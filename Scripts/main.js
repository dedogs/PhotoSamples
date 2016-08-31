function appendImages(src) {
    var image,
        section = $("section").first(),
        width = section.width(),
        height = 833,
        fragment = document.createDocumentFragment(),
        div,
        i = 0,
        setWidth = function (src) {
            var position = src.indexOf("p=") + 2,
                handler = src.substring(0, position),
                o = JSON.parse(src.substring(position, src.length));

            o.Dimensions.Width = width;
            o.Dimensions.Height = height;
            return handler + JSON.stringify(o);
        };

    i = 0;
    (function imageLoad() {
        if (src[i]) {
            image = document.createElement('img');
            src[i] = setWidth(src[i]);
            image.src = src[i];
            image.onload = function () {

                div = document.createElement("div");
                div.setAttribute("class", "img-content")
                div.setAttribute("data-src", src[i]);
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
            section.append(fragment);
        }
    }())
}