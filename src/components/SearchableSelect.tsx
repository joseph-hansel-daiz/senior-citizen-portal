"use client";
import { useState, useRef, useEffect } from "react";

interface SearchableSelectOption {
  value: string | number;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "-- Choose --",
  disabled = false,
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset search term when value changes externally
  useEffect(() => {
    if (!isFocused && !isOpen) {
      setSearchTerm("");
    }
  }, [value, isFocused, isOpen]);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
    setIsFocused(false);
    setSearchTerm("");
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsFocused(true);
      setIsOpen(true);
      // Clear input to show search term when focusing
      if (selectedOption) {
        setSearchTerm("");
      }
    }
  };

  const handleInputBlur = () => {
    // Delay to allow click events on options to fire
    setTimeout(() => {
      if (!isOpen) {
        setIsFocused(false);
        setSearchTerm("");
      }
    }, 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsOpen(true);
  };

  // Display value: show search term when focused (even if empty), otherwise show selected option label
  const displayValue = isFocused 
    ? searchTerm 
    : (selectedOption?.label || "");

  return (
    <div ref={containerRef} className={`position-relative ${className}`}>
      <div className={`input-group ${isFocused ? "focused" : ""}`}>
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => {
            if (!disabled) {
              if (!isOpen) {
                inputRef.current?.focus();
                setIsOpen(true);
                setIsFocused(true);
              } else {
                setIsOpen(false);
                setIsFocused(false);
                setSearchTerm("");
                inputRef.current?.blur();
              }
            }
          }}
          disabled={disabled}
          style={isFocused ? { borderColor: "#86b7fe", boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" } : {}}
        >
          <i className={`bi bi-chevron-${isOpen ? "up" : "down"}`}></i>
        </button>
      </div>
      {isOpen && !disabled && (
        <div
          className="position-absolute w-100 bg-white border rounded mt-1 shadow-lg"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 1000,
            top: "100%",
          }}
        >
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-muted">No options found</div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`p-2 ${
                  option.value === value ? "bg-primary text-white" : ""
                }`}
                style={{ cursor: "pointer" }}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input blur before click
                  handleSelect(option.value);
                }}
                onMouseEnter={(e) => {
                  if (option.value !== value) {
                    e.currentTarget.classList.add("bg-light");
                  }
                }}
                onMouseLeave={(e) => {
                  if (option.value !== value) {
                    e.currentTarget.classList.remove("bg-light");
                  }
                }}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

