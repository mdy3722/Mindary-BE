export const toDataURL = (url) => {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
};

export const downloadFile = async (url, fileName) => {
  const a = document.createElement("a");
  a.href = await toDataURL(url);
  a.download = fileName ?? "download.png";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
