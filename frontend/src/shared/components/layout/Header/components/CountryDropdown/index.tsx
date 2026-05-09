import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';

import { FaAngleDown } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { MdClose } from "react-icons/md";

import type { TransitionProps } from '@mui/material/transitions';

// Transition (TypeScript safe)
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Dropdown Button */}
      <Button
        className="countryDropdown"
        onClick={() => setOpen(true)}
      >
        <div className="info">
          <span className="label">Your Location</span>
          <span className="name">Select Location</span>
        </div>

        <span className="arrowIcon">
          <FaAngleDown />
        </span>
      </Button>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="locationDialog"
        TransitionComponent={Transition}
      >
        {/* Close Button */}
        <IconButton
          className="closeBtn"
          onClick={() => setOpen(false)}
        >
          <MdClose />
        </IconButton>

        {/* Header */}
        <h4>Choose Your Delivery Location</h4>
        <p>
          Enter your address and we will specify the offer for your area.
        </p>

        {/* Search */}
        <div className="locationSearch">
          <input type="text" placeholder="Search your area..." />

          <Button className="searchBtn">
            <IoSearch />
          </Button>
        </div>

        {/* Countries List */}
        <ul className="countriesList">
          <li><Button>Yemen</Button></li>
          <li><Button>Saudi Arabia</Button></li>
          <li><Button>United Arab Emirates</Button></li>
          <li><Button>Oman</Button></li>
          <li><Button>Kuwait</Button></li>
          <li><Button>Bahrain</Button></li>
        </ul>
      </Dialog>
    </>
  );
};

export default CountryDropdown;