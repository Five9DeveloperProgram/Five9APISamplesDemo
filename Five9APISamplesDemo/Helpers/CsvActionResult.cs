using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Reflection;
using System.Text;
using System.Web.Mvc;

namespace CTIWEBFIVE9.Helpers
{
    public class CsvActionResult<T> : FileResult
    {
        private readonly IList<T> _list;
        private readonly char _separator;

        public CsvActionResult(IList<T> list,
            string fileDownloadName,
            char separator = ',')
            : base("text/csv")
        {
            _list = list;
            FileDownloadName = fileDownloadName;
            _separator = separator;
        }

        protected override void WriteFile(HttpResponseBase response)
        {
            var outputStream = response.OutputStream;
            using (var memoryStream = new MemoryStream())
            {
                WriteList(memoryStream);
                outputStream.Write(memoryStream.GetBuffer(), 0, (int)memoryStream.Length);
            }
        }

        private void WriteList(Stream stream)
        {
            var streamWriter = new StreamWriter(stream, Encoding.Default);

            WriteHeaderLine(streamWriter);
            streamWriter.WriteLine();
            WriteDataLines(streamWriter);

            streamWriter.Flush();
        }

        private void WriteHeaderLine(StreamWriter streamWriter)
        {
            foreach (MemberInfo member in typeof(T).GetProperties())
            {
                WriteValue(streamWriter, member.Name);
            }
        }

        private void WriteDataLines(StreamWriter streamWriter)
        {
            foreach (T line in _list)
            {
                foreach (MemberInfo member in typeof(T).GetProperties())
                {
                    WriteValue(streamWriter, GetPropertyValue(line, member.Name));
                }
                streamWriter.WriteLine();
            }
        }


        private void WriteValue(StreamWriter writer, String value)
        {
            writer.Write("\"");
            writer.Write(value.Replace("\"", "\"\""));
            writer.Write("\"" + _separator);
        }

        public static string GetPropertyValue(object src, string propName)
        {
            if (src.GetType().GetProperty(propName).GetValue(src, null) == null)
            {
                return "";
            }
            else
            {
                return src.GetType().GetProperty(propName).GetValue(src, null).ToString() ?? "";
            }
        }

    }
}