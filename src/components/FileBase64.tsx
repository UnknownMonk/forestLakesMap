import { useState } from 'react';

interface FileInfo {
  name: string;
  type: string;
  size: string;
  base64: string | ArrayBuffer | null;
  file: File;
}

type OnDoneCallback = (files: FileInfo[] | FileInfo) => void;

export default function FileBase64({
  onDone,
  multiple,
}: {
  onDone: OnDoneCallback;
  multiple: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const filePromises: Promise<FileInfo>[] = [];

    for (let i = 0; i < files.length; i++) {
      filePromises.push(processFile(files[i]));
    }

    Promise.all(filePromises).then((fileInfos) => {
      if (multiple) {
        onDone(fileInfos);
      } else {
        onDone(fileInfos[0]);
      }
    });
  };

  const processFile = (file: File): Promise<FileInfo> => {
    return new Promise<FileInfo>((resolve) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64 = event.target?.result || null;

        const fileInfo: FileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + ' kB',
          base64,
          file,
        };

        resolve(fileInfo);
      };

      reader.readAsDataURL(file);
    });
  };

  return <input type="file" onChange={handleChange} />;
}
