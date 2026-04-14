function buildImageURL(req, path) {
  if (!path) {
    return "";
  }

  // get scheme (handle reverse proxy)
  let scheme = req.headers["x-forwarded-proto"];
  if (!scheme) {
    scheme = req.secure ? "https" : "http";
  }

  // get host
  let host = req.headers["x-forwarded-host"];
  if (!host) {
    host = req.headers.host;
  }

  // clean double slash
  const cleanPath = "/" + path.replace(/^\/+/, "");

  return `${scheme}://${host}${cleanPath}`;
}

export default buildImageURL;