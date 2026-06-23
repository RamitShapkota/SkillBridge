import { Search } from "lucide-react";
import type { ChangeEvent } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  style?: React.CSSProperties;
};

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "relative",
  inputClassName = "w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-slate-900 placeholder-slate-300 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 shadow-sm",
  iconClassName = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400",
  style = { fontSize: "0.875rem" },
}: SearchInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={className}>
      <Search className={iconClassName} />
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClassName}
        style={style}
      />
    </div>
  );
}
