import React from "react";
import "./styles.css";

type Props = {
  min: number;
  max: number;
  onChange: (values: { minPrice: number; maxPrice: number }) => void;
};

const PriceFilter: React.FC<Props> = ({ min, max, onChange }) => {
  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), max - 100);

    onChange({
      minPrice: value,
      maxPrice: max,
    });
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), min + 100);

    onChange({
      minPrice: min,
      maxPrice: value,
    });
  };

  return (
    <div className="filterSection mb-4">
      <h6 className="sidebarSectionTitle">Filter By Price</h6>

      {/* SLIDER WRAPPER */}
      <div className="range-wrapper">
        {/* MIN */}
        <input
          type="range"
          min="0"
          max="5000"
          value={min}
          onChange={handleMin}
          className="range-slider"
        />

        {/* MAX */}
        <input
          type="range"
          min="0"
          max="5000"
          value={max}
          onChange={handleMax}
          className="range-slider"
        />

        {/* TRACK VISUAL */}
        <div className="range-track">
          <div
            className="range-progress"
            style={{
              left: `${(min / 5000) * 100}%`,
              right: `${100 - (max / 5000) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* VALUES */}
      <div className="d-flex justify-content-between mt-2 small text-muted fw-bold">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
};

export default PriceFilter;