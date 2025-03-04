export const getUrlSearchParams = (urlString?: string) => {
  const url = new URL(urlString ? `${window.location.host}/${urlString}` : window.location.href);
  const searchParams = new URLSearchParams(url.search);

  return searchParams
}

export const queryParamObject = (urlString?: string) => {
  const searchParams = getUrlSearchParams(urlString);

  const currentQueryObj: any = {}
  for (const [key, value] of searchParams.entries()) {
    console.log(`${key}, ${value}`);
    currentQueryObj[key] = value;
  }

  return currentQueryObj;
}
