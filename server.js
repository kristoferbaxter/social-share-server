import polka from "polka";
import parser from "ua-parser-js";

const { PORT = 3001 } = process.env;

polka()
  .get("/:file.html", (req, res) => {
    const ua = parser(req.headers["user-agent"]);
    const supportsBlinkSharing = ua.engine.name === "Blink" && Number(ua.engine.version.split(".")[0]) > 61 && ua.os.name === "Android";
    const supportsIOSSharing = ua.os.name === "iOS" && Number(ua.os.version.split(".")[0]) >= 13; 
    const supportsSocialDirectly = supportsBlinkSharing || supportsIOSSharing;

    const output = `<!doctype html>
<html amp lang="en">
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-social-share" src="https://cdn.ampproject.org/v0/amp-social-share-0.1.js"></script>
    <title>Hello, AMPs</title>
    <link rel="canonical" href="https://amp.dev/documentation/guides-and-tutorials/start/create/basic_markup/">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <script type="application/ld+json">
      {
        "@context": "http://schema.org",
        "@type": "NewsArticle",
        "headline": "Open-source framework for publishing content",
        "datePublished": "2015-10-07T12:02:41Z",
        "image": [
          "logo.jpg"
        ]
      }
    </script>
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  </head>
  <body>
    <h1>supports system? ${supportsSocialDirectly}</h1>
    ${supportsSocialDirectly ? `<amp-social-share type="system" width="60" height="44"></amp-social-share>
    <amp-social-share type="email" width="60" height="44"></amp-social-share>` : `<amp-social-share type="email" width="60" height="44"></amp-social-share>`}
  </body>
</html>
`;

    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.write(output);
    res.end();
  })
  .listen(PORT, _ => {
    console.log(`> Running on http://localhost:${PORT}`);
  });
 