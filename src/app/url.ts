const isProd = process.env.NODE_ENV === "production";

const apiurl = isProd
  ? process.env.NEXT_PUBLIC_API_URL_PROD
  : process.env.NEXT_PUBLIC_API_URL_DEV;

  const webapiurl = isProd
  ? process.env.NEXT_PUBLIC_WEBAPI_URL_PROD
  : process.env.NEXT_PUBLIC_WEBAPI_URL_DEV;

const urls = {
  baseurl: apiurl,
  basewebapiurl:webapiurl
};

export default urls;
