import React, { forwardRef, LegacyRef } from "react";

function Input(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { label?: string },
  ref: LegacyRef<HTMLInputElement>
) {
  return (
    <div className="w-full">
      <label>
        <div className="text-sm mb-2">{props.label}</div>
        <input
          ref={ref}
          {...props}
          className="border w-full h-12 pl-3 border-[#737373] rounded-xl text-[#474646]"
        />
      </label>
    </div>
  );
}

export default forwardRef(Input);
