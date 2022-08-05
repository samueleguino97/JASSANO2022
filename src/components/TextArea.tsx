import React, { forwardRef, LegacyRef } from "react";

function TextArea(
  props: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > & { label?: string },
  ref: LegacyRef<HTMLTextAreaElement>
) {
  return (
    <div className="w-full">
      <label>
        <div className="text-sm mb-2">{props.label}</div>
        <textarea
          ref={ref}
          {...props}
          className="border w-full h-12 pl-3 border-[#737373] rounded-xl text-[#474646]"
        />
      </label>
    </div>
  );
}

export default forwardRef(TextArea);
