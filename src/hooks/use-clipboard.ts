import { useCallback  } from "react";
import { commands } from "@/bindings";
import {  ClipboardContent } from "@/types/clipboard";

export const useClipboard = () => {
  const read = useCallback(async (): Promise<string> => {
    const result = await commands.readClipboard();
    if (result.status === "ok") {
      return result.data || "";
    }

    return "";
  }, []);

  const readImage = useCallback(async (): Promise<{
    base64Data: string;
    width: number;
    height: number;
  } | null> => {
    const result = await commands.readClipboardImage();
    if (result.status === "ok") {
      if (result.data) {
        const [base64Data, width, height] = result.data;
        return { base64Data, width, height };
      }
      return null;
    }

    return null;
  }, []);

  const readContent = useCallback(async (): Promise<ClipboardContent> => {
    try {
      const imageResult = await readImage();
      if (imageResult) {
        return {
          type: "image",
          base64Data: imageResult.base64Data,
          width: imageResult.width,
          height: imageResult.height,
        };
      }
    } catch {
      // Image read failed, try text
    }

    const text = await read();
    if (text) {
      return { type: "text", text };
    }

    return { type: "empty" };
  }, [read, readImage]);

  const writeTextToClipboard = useCallback(
    async (text: string) => {
      const result = await commands.writeClipboard(text);
      if (result.status === "ok") {
        return;
      }

      throw result.error;
    },
    [],
  );

  const writeImageToClipboard = useCallback(
    async (base64ImageData: string) => {
      //@ts-ignore
      const { status, error } = await commands.writeClipboardImage(base64ImageData);
      if (status === 'ok') return

      throw error;
    },
    [],
  );

  const reinitialize = useCallback(async (): Promise<void> => {
    const result = await commands.reinitializeClipboard();
    if (result.status === "ok") {
      return;
    }

    throw result.error;
  }, []);

  return {
    read,
    readImage,
    readContent,
    writeTextToSystemClipboard: writeTextToClipboard,
    writeImageToSystemClipboard: writeImageToClipboard,
    reinitialize,
  };
};
