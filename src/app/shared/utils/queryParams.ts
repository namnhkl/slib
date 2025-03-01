export const getUrlSearchParams = () => {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  return searchParams
}

export const queryParamObject = () => {
  const searchParams = getUrlSearchParams();

  const currentQueryObj: any = {}
  for (const [key, value] of searchParams.entries()) {
    console.log(`${key}, ${value}`);
    currentQueryObj[key] = value;
  }

  return currentQueryObj;
}
