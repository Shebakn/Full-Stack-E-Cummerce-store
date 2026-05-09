import React from "react";
import { Checkbox, FormControlLabel, Rating } from "@mui/material";
import "./styles.css";

type Props = {
  selected: number[];
  onChange: (ratings: number[]) => void;
};

const RatingFilter: React.FC<Props> = ({ selected, onChange }) => {
  const toggleRating = (value: number) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    onChange(updated);
  };

  return (
    <div className="categoryTree">
      <h6 className="sidebarSectionTitle">Filter By Rating</h6>

      {[5, 4, 3, 2, 1].map((star) => (
        <div key={star} className="categoryNode">
          <div className="categoryRow">
            <FormControlLabel
              className="categoryLabel"
              control={
                <Checkbox
                  size="small"
                  checked={selected.includes(star)}
                  onChange={() => toggleRating(star)}
                />
              }
              label={
                <Rating value={star} readOnly size="small" />
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RatingFilter;