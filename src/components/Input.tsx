import React, { forwardRef, LegacyRef } from "react";

function Input(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { label?: string; error?: string },
  ref: LegacyRef<HTMLInputElement>
) {
  return (
    <div className="w-full">
      <label>
        <div className={`${!!props.error ? "text-red-400" : ""} text-sm mb-2`}>
          {props.label}
        </div>
        <input
          ref={ref}
          {...props}
          className={`border w-full h-12 pl-3 pr-3 focus:outline-orange-400 border-[#737373] ${
            !!props.error ? "border-red-400 placeholder:text-red-400" : ""
          } rounded-xl text-[#474646]`}
        />
      </label>
    </div>
  );
}

export default forwardRef(Input);
