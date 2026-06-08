"use client";

import dynamic from "next/dynamic";
import { Controller, useFormContext } from "react-hook-form";
import "suneditor/dist/css/suneditor.min.css";

import {
  align,
  font,
  fontColor,
  fontSize,
  formatBlock,
  hiliteColor,
  horizontalRule,
  // image,
  lineHeight,
  link,
  list,
  paragraphStyle,
  table,
  template,
  textStyle,
  video
} from "suneditor/src/plugins";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
  loading: () => <div className='bg-muted h-48 w-full animate-pulse rounded-md border' />
});

type RichTextEditorProps = {
  name: string;
  disabled?: boolean;
  placeholder?: string;
  height?: string;
};

function RichTextEditor({ name, disabled = false, placeholder = "Enter your text here", height = "300" }: RichTextEditorProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={disabled ? "cursor-not-allowed opacity-60" : ""}>
          <SunEditor
            setContents={field.value || ""}
            onChange={content => field.onChange(content)}
            onBlur={field.onBlur}
            height={height}
            readOnly={disabled}
            lang='en'
            setOptions={{
              showPathLabel: false,
              placeholder,
              plugins: [
                align,
                font,
                fontColor,
                fontSize,
                formatBlock,
                hiliteColor,
                horizontalRule,
                lineHeight,
                list,
                paragraphStyle,
                table,
                template,
                textStyle,
                // image,
                link,
                video
              ],
              buttonList: [
                ["bold", "italic", "underline", "fontColor", "hiliteColor"],
                ["align", "lineHeight", "horizontalRule", "list"],
                ["undo", "redo"],
                ["removeFormat"],
                ["font", "fontSize"],
                [
                  "table",
                  "link"
                  // "image", "video"
                ]
                // ["fullScreen"],
              ],
              resizingBar: !disabled
            }}
          />
        </div>
      )}
    />
  );
}

export default RichTextEditor;
