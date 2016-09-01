using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.PhotoSamples.Models.Helpers
{
    public static class ImageHelper
    {
        public static MvcHtmlString Image(this HtmlHelper helper, string src, string altText, int width, int height)
        {
            var builder = new TagBuilder("img");
            builder.MergeAttribute("src", src);
            builder.MergeAttribute("alt", altText);
            builder.MergeAttribute("width", Convert.ToString(width));
            builder.MergeAttribute("height", Convert.ToString(height));
            return MvcHtmlString.Create(builder.ToString(TagRenderMode.SelfClosing));
        }
    }
}