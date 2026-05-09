import React, { useState } from "react";
import { Checkbox } from "@mui/material";
import "./styles.css";

/* ================= TYPES ================= */
type Category = {
  id: string;
  name: string;
  children?: Category[];
};

type Props = {
  categories: Category[];

  // 🔥 بدل single id
  selectedIds: string[];

  // 🔥 يرجع array كاملة
  onChange?: (ids: string[]) => void;
};

/* ================= NODE ================= */
const CategoryNode = ({
  category,
  selectedIds,
  onChange,
}: {
  category: Category;
  selectedIds: string[];
  onChange?: (ids: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);

  const hasChildren = category.children && category.children.length > 0;

  const checked = selectedIds.includes(category.id);

  const handleToggle = () => {
    let updated: string[];

    if (checked) {
      updated = selectedIds.filter((id) => id !== category.id);
    } else {
      updated = [...selectedIds, category.id];
    }

    onChange?.(updated);
  };

  return (
    <div className="categoryNode">

      {/* ROW */}
      <div className="categoryRow">

        {/* TOGGLE */}
        {hasChildren ? (
          <button
            type="button"
            className="toggleBtn"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? "▾" : "▸"}
          </button>
        ) : (
          <span className="togglePlaceholder" />
        )}

        {/* CHECKBOX + LABEL */}
        <div className="categoryContent" onClick={handleToggle}>
          <Checkbox size="small" checked={checked} />
          <span className="categoryText">{category.name}</span>
        </div>

      </div>

      {/* CHILDREN */}
      {hasChildren && open && (
        <div className="categoryChildren">
          {category.children!.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              selectedIds={selectedIds}
              onChange={onChange}
            />
          ))}
        </div>
      )}

    </div>
  );
};

/* ================= ROOT ================= */
const CategoryTree: React.FC<Props> = ({
  categories,
  selectedIds,
  onChange,
}) => {
  return (
    <div className="categoryTree">
      {categories.map((cat) => (
        <CategoryNode
          key={cat.id}
          category={cat}
          selectedIds={selectedIds}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default CategoryTree;