import React from "react";

function ButtonSelect({
  value,
  onChange,
  leftButtonText = "Si",
  rightButtonText = "No",
}: {
  value: boolean;
  onChange: (newValue: boolean) => void;
  leftButtonText?: string;
  rightButtonText?: string;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={`inline-flex flex-1 justify-center rounded-md border border-transparent bg-orange-100 px-8 py-2 text-sm font-medium text-orange-900 ${
          value ? "bg-orange-300" : ""
        } hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2`}
        onClick={() => onChange(true)}
      >
        {leftButtonText}
      </button>{" "}
      <button
        type="button"
        className={`inline-flex flex-1 justify-center rounded-md border border-transparent bg-orange-100 px-8 py-2 text-sm font-medium text-orange-900 ${
          !value ? "bg-orange-300" : ""
        } hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2`}
        onClick={() => onChange(false)}
      >
        {rightButtonText}
      </button>
    </div>
  );
}

export default ButtonSelect;
