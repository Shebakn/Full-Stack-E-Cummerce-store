import React from "react";
import Button from "@mui/material/Button";
import { IoSearch } from "react-icons/io5";

type Props = {
  value: string;
  onSearch: (value: string) => void;
};

export const ProductSearchBar = ({ value, onSearch }: Props) => {
  const [localValue, setLocalValue] = React.useState(value);

  // sync when parent changes (filters reset / url change)
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSearch = () => {
    onSearch(localValue.trim());
  };

  return (
    <div className="headerSearch d-flex align-items-center">
      <input
        type="text"
        placeholder="Search for products..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />

      <Button aria-label="Search" onClick={handleSearch}>
        <IoSearch />
      </Button>
    </div>
  );
};

export default ProductSearchBar;