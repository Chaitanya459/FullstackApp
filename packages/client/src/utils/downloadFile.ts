import { AxiosResponse } from 'axios';

export const downloadFile = (response: AxiosResponse<BlobPart | Blob>) => {
  const contentDisposition = response.headers[`content-disposition`] as string;
  const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
  const fileName = fileNameMatch ? fileNameMatch[1] : `export.csv`;
  const url = window.URL.createObjectURL(new Blob([ response.data ]));
  const link = document.createElement(`a`);
  link.href = url;
  link.setAttribute(`download`, fileName);
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    link.remove();
    window.URL.revokeObjectURL(url);
  }, 500);
};
