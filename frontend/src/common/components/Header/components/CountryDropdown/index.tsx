import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";

import { FaAngleDown } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { MdClose } from "react-icons/md";

import type { TransitionProps } from "@mui/material/transitions";

/* ================= TRANSITION ================= */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* ================= TYPES ================= */
export type Country = {
  id: string;
  name: string;
  code?: string;
};

type Props = {
  countries: Country[];
  loading?: boolean;
  selectedCountry?: Country | null;
  onSelectCountry: (country: Country) => void;
};

const CountryDropdown: React.FC<Props> = ({
  countries,
  loading = false,
  selectedCountry,
  onSelectCountry,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [ selected, setSelected ] = useState(selectedCountry)
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (country: Country) => {
    onSelectCountry(country);
    setSelected(country);
    setOpen(false);
  };

  return (
    <>
      {/* ================= TRIGGER ================= */}
      <Button className="countryDropdown" onClick={() => setOpen(true)}>
        <div className="info">
          <span className="label">Your Location</span>
          <span className="name">
            {selected ? selected.name : "Select Location"}
          </span>
        </div>

        <span className="arrowIcon">
          <FaAngleDown />
        </span>
      </Button>

      {/* ================= DIALOG ================= */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="locationDialog"
        TransitionComponent={Transition}
      >
        <IconButton className="closeBtn" onClick={() => setOpen(false)}>
          <MdClose />
        </IconButton>

        <h4>Choose Your Delivery Location</h4>
        <p>Enter your country to continue shopping.</p>

        {/* ================= SEARCH ================= */}
        <div className="locationSearch">
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button className="searchBtn">
            <IoSearch />
          </Button>
        </div>

        {/* ================= LIST ================= */}
        <ul className="countriesList">
          {loading ? (
            <div style={{ padding: 20, textAlign: "center" }}>
              <CircularProgress size={24} />
            </div>
          ) : filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <li key={country.id}>
                <Button
                  className={
                    selectedCountry?.id === country.id ? "active" : ""
                  }
                  onClick={() => handleSelect(country)}
                >
                  {country.name}
                </Button>
              </li>
            ))
          ) : (
            <p style={{ padding: 10, color: "#999" }}>No countries found</p>
          )}
        </ul>
      </Dialog>
    </>
  );
};

export default CountryDropdown;