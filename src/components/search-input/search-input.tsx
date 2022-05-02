import { useCallback, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Modifier, usePopper } from "react-popper";
import { MeteorData } from "../../types";
import "./search-input.css";

const rootOverlay = document.getElementById("root-overlay");

export type SearchInputProps = {
  onChange: (value: string) => void;
  value: string;
  results?: MeteorData[];
  placeholder?: string;
};

// search input component
export const SearchInput: React.VFC<SearchInputProps> = ({
  onChange,
  value,
  placeholder,
  results,
}) => {
  const modifiers: Modifier<string>[] = useMemo(
    () => [
      {
        name: "sameWidth",
        enabled: true,
        fn: ({ state }) => {
          state.styles.popper.width = `${state.rects.reference.width}px`;
        },
        phase: "beforeWrite",
        requires: ["computeStyles"],
      },
    ],
    []
  );

  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const overLayRef = useRef(null);
  const { styles, attributes } = usePopper(ref.current, overLayRef.current, {
    placement: "bottom-start",
    modifiers,
  });

  const showAutoComplete =
    focused &&
    results &&
    rootOverlay &&
    value &&
    Number(value) !== results[0]?.year;

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const overLay = (
    <ul
      ref={overLayRef}
      style={styles.popper}
      {...attributes.popper}
      className="autoComplete"
    >
      {results &&
        [...new Set(results.map(({ year }) => year))].map((year) => {
          return (
            <li
              onClick={() => {
                onChange(`${year}`);
                setFocused(false);
              }}
              className="autoComplete-item"
              key={year}
            >
              {year}
            </li>
          );
        })}
    </ul>
  );

  return (
    <>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChangeHandler}
        placeholder={placeholder}
        className="search-input"
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (e.relatedTarget) {
            setFocused(false);
          }
        }}
      />
      {showAutoComplete && ReactDOM.createPortal(overLay, rootOverlay)}
    </>
  );
};
