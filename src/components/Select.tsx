import { Combobox } from "@headlessui/react";
import React, { forwardRef, LegacyRef, useState } from "react";

import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

function Select(
  {
    onChange,
    value,
    options,
    label,
    placeholder,
    error,
  }: {
    onChange: (newValue: string) => void;
    value: string;
    options: { id: string; label: string }[];
    label: string;
    placeholder: string;
    error?: string;
  },
  ref: LegacyRef<HTMLInputElement>
) {
  const [query, setQuery] = useState("");
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  return (
    <div>
      <div className={`${!!error ? "text-red-400" : ""} text-sm mb-2`}>
        {label}
      </div>
      <Combobox value={value} onChange={onChange}>
        <div className="relative">
          <Combobox.Input
            ref={ref}
            placeholder={placeholder}
            displayValue={(option: string) =>
              options?.find((o) => o.id === option)?.label || ""
            }
            className={`border w-full h-12 pl-3 border-[#737373]  ${
              !!error ? "border-red-400 placeholder:text-red-400" : ""
            } rounded-xl focus:outline-orange-400 text-[#474646] pr-8`}
            onChange={(event) => setQuery(event.target.value)}
          />

          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon
              className={`h-5 w-5 text-gray-400 ${
                !!error ? "text-red-400" : ""
              } `}
              aria-hidden="true"
            />
          </Combobox.Button>
          <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-orange-600 text-white" : "text-gray-900"
                  }`
                }
                value={option.id}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.label as any as string}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-white" : "text-orange-600"
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}

export default forwardRef(Select);
