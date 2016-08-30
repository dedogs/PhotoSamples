using deDogs.Toolbox.Image;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace com.PhotoSamples.Controllers
{

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            List<string> imageProperties = new List<string>();

            DirectoryInfo directory = new DirectoryInfo(Server.MapPath("~/Images"));

            foreach (FileInfo file in directory.GetFiles())
            {
                ImageProperties imageProperty = new ImageProperties
                {
                    Name = file.Name,
                    Path = "/Images",
                    Dimensions = new Dimension<int>
                    {
                        Width = 300,
                        Height = 300
                    }
                };

                imageProperties.Add("/thumbImage?p=" + serializer.Serialize(imageProperty));
            }
            return View(imageProperties);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}