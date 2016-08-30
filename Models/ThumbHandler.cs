using System;
using System.Web;
using System.Web.Script.Serialization;
using System.Drawing;
using deDogs.Toolbox;
using deDogs.Toolbox.Image;
using System.Web.Routing;
using System.IO;
using System.Collections.Specialized;
namespace com.PhotoSamples.Models
{
    public class ThumbHandler : IRouteHandler, IDisposable
    {

        //Expected JSON string: p = {dimensions: { int, int } , name: string, path: string, title: string, type: string}
        protected Bitmap bitMap;

        public IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            if (_disposed)
                throw new ObjectDisposedException("ThumbHandlerState");

            NameValueCollection routeValues = requestContext.HttpContext.Request.QueryString;
            if (!String.IsNullOrEmpty(routeValues.Get("p")))
            {
                var serializer = new JavaScriptSerializer();

                ImageProperties imageProperties = serializer.Deserialize<ImageProperties>(routeValues.Get("p"));

                string path = "~" + imageProperties.Path + "/" + imageProperties.Name + imageProperties.Type;

                using (Thumbnails thumbnails = new Thumbnails(path))
                {
                    thumbnails.maximum = new Dimension<int> { Width = imageProperties.Dimensions.Width, Height = imageProperties.Dimensions.Height };

                    thumbnails.Create(out bitMap);

                    requestContext.HttpContext.Response.Clear();
                    requestContext.HttpContext.Response.BufferOutput = true;

                    bitMap.Save(requestContext.HttpContext.Response.OutputStream, imageProperties.ContentType());
                    requestContext.HttpContext.Response.Flush();
                    requestContext.HttpContext.Response.Close();
                }
            }

            return null;
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