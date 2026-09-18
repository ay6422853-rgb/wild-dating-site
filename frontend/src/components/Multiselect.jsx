import React from "react";
export default function MultiSelect({
  label,
  options,
  values = [],
  setValues,
}) {
  const toggle = (value) => {
    if (values.includes(value)) {
      setValues(values.filter((item) => item !== value));
    } else {
      setValues([...values, value]);
    }
  };

  return (
    <fieldset className="choice-section">
      <legend>{label}</legend>

      <div className="chips">
        {options.map(([value, text]) => (
          <button
            type="button"
            key={value}
            className={
              values.includes(value)
                ? "chip selected"
                : "chip"
            }
            onClick={() => toggle(value)}
          >
            {text}
          </button>
        ))}
      </div>
    </fieldset>
  );
}