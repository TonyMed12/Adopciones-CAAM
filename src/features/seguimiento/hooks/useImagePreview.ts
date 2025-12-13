import { useState } from "react";
import { toast } from "sonner";

export function useImagePreview(max = 5) {
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);

  const addFiles = (
    fileList: FileList | null,
    onChange?: (files: FileList) => void
  ) => {
    if (!fileList) return;

    const selected = Array.from(fileList);

    if (selected.length + files.length > max) {
      toast.error(`Solo puedes subir máximo ${max} fotos.`);
      return;
    }

    const newFiles = [...files, ...selected];
    const newUrls = newFiles.map((f) => URL.createObjectURL(f));

    setFiles(newFiles);
    setUrls(newUrls);

    if (onChange) {
      const dt = new DataTransfer();
      newFiles.forEach((f) => dt.items.add(f));
      onChange(dt.files);
    }
  };

  const removeFile = (
    index: number,
    onChange?: (files: FileList) => void
  ) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newUrls = urls.filter((_, i) => i !== index);

    setFiles(newFiles);
    setUrls(newUrls);

    if (onChange) {
      const dt = new DataTransfer();
      newFiles.forEach((f) => dt.items.add(f));
      onChange(dt.files);
    }
  };

  const reset = () => {
    setFiles([]);
    setUrls([]);
  };

  return {
    files,
    urls,
    addFiles,
    removeFile,
    reset,
  };
}
