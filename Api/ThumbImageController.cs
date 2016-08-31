using deDogs.Toolbox.Image;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace com.PhotoSamples.Controllers
{
    public class ThumbImageController : ApiController
    {
        protected Bitmap bitMap;

        // GET: api/Values
        public HttpResponseMessage Get(string p)
        {
            HttpResponseMessage result = null;

            if (_disposed)
                throw new ObjectDisposedException("ThumbHandlerState");

            NameValueCollection routeValues = HttpContext.Current.Request.QueryString;
            if (!String.IsNullOrEmpty(p))
            {
                var serializer = new JavaScriptSerializer();

                ImageProperties imageProperties = serializer.Deserialize<ImageProperties>(p);

                string path = "~" + imageProperties.Path + "/" + imageProperties.Name + imageProperties.Type;

                using (Thumbnails thumbnails = new Thumbnails(path))
                {
                    thumbnails.maximum = new Dimension<int> { Width = imageProperties.Dimensions.Width, Height = imageProperties.Dimensions.Height };

                    thumbnails.Create(out bitMap);
                    MemoryStream ms = new MemoryStream();

                    bitMap.Save(ms, imageProperties.ContentType());
                    ms.Position = 0;

                    result = new HttpResponseMessage(HttpStatusCode.OK);
                    result.Content = new StreamContent(ms);
                    result.Content.Headers.ContentLength = ms.Length;
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/" + imageProperties.ContentType().ToString().ToLower());

                }
            }

            return result;
        }

        private bool _disposed;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(true);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
                return;

            if (disposing)
            {
                if (bitMap != null)
                {
                    bitMap.Dispose();
                    bitMap = null;
                }
                _disposed = true;
            }
        }
    }
}
