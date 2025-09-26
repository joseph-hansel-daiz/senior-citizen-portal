import React from "react";

interface Option {
  id: number;
  name: string;
}

export function renderCheckboxOptions(options: Option[]) {
  return options.map((option) => (
    <div className="form-check" key={`${option.id}-${option.name}`}>
      <input
        className="form-check-input"
        type="checkbox"
        value={option.id.toString()}
        id={`${option.id}-${option.name}`}
      />
      <label
        className="form-check-label"
        htmlFor={`${option.id}-${option.name}`}
      >
        {option.name}
      </label>
    </div>
  ));
}

export function renderRadioOptions(options: Option[], groupName: string) {
  return options.map((option) => {
    const inputId = `${groupName}-${option.id}`;

    return (
      <div className="form-check" key={inputId}>
        <input
          className="form-check-input"
          type="radio"
          name={groupName}
          value={option.id.toString()}
          id={inputId}
        />
        <label className="form-check-label" htmlFor={inputId}>
          {option.name}
        </label>
      </div>
    );
  });
}
