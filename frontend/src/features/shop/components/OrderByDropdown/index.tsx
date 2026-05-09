import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";

import { FaAngleDown } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

import type { TransitionProps } from "@mui/material/transitions";

/* ================= TRANSITION ================= */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* ================= OPTIONS ================= */
const options = [
  { label: "Newest First", value: "createdAt_desc" },
  { label: "Oldest First", value: "createdAt_asc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating_desc" },
];

const OrderByDropdown: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
}> = ({ value = "createdAt_desc", onChange }) => {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <>
      {/* BUTTON */}
      <Button className="countryDropdown" onClick={() => setOpen(true)}>
        <div className="info">
          <span className="label">Sort By</span>
          <span className="name">{selected?.label || "Select Order"}</span>
        </div>

        <span className="arrowIcon">
          <FaAngleDown />
        </span>
      </Button>

      {/* DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="locationDialog"
        TransitionComponent={Transition}
      >
        {/* CLOSE */}
        <IconButton className="closeBtn" onClick={() => setOpen(false)}>
          <MdClose />
        </IconButton>

        {/* HEADER */}
        <h4>Sort Products</h4>
        <p>Choose how you want to display products</p>

        {/* LIST */}
        <ul className="countriesList">
          {options.map((opt) => (
            <li key={opt.value}>
              <Button
                className={value === opt.value ? "activeSort" : ""}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </Button>
            </li>
          ))}
        </ul>
      </Dialog>
    </>
  );
};

export default OrderByDropdown;