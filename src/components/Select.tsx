import { Combobox, Listbox } from "@headlessui/react";
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
  ref: LegacyRef<HTMLButtonElement>
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
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            ref={ref}
            // displayValue={(option: string) =>
            //   options?.find((o) => o.id === option)?.label || ""
            // }
            className={` text-[#474646] border w-full min-w-[200px] h-12 pl-3 border-[#737373] ${
              !options.find((o) => o.id === value)?.label
                ? "text-gray-400 text-sm"
                : ""
            }  ${
              !!error ? "border-red-400 text-red-400 text-sm" : ""
            } rounded-xl focus:outline-orange-400  whitespace-nowrap pr-8 text-left`}
            // onChange={(event) => setQuery(event.target.value)}
          >
            {options.find((o) => o.id === value)?.label || placeholder}
          </Listbox.Button>

          <Listbox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon
              className={`h-5 w-5 text-gray-400 ${
                !!error ? "text-red-400" : ""
              } `}
              aria-hidden="true"
            />
          </Listbox.Button>
          <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <Listbox.Option
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
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}

export default forwardRef(Select);
