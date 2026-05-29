
import React, { useState, useEffect } from "react";
import { Avatar, Chip, Box } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface FilterChipProps {
  items: string[];
  onSelect: (selectedItem: string[] | null) => void;
  selectedCategory: string;
}

const categoryColors: Record<string, "primary" | "warning" | "success" | "info"> = {
  Total: "primary",
  Pending: "warning",
  Completed: "success",
  Content: "info",
};

const FilterChip: React.FC<FilterChipProps> = ({ items, onSelect, selectedCategory }) => {
  const [selectedItem, setSelectedItem] = useState<string>("ALL");

  useEffect(() => {
    setSelectedItem("ALL");
    onSelect(null); // Ensure parent gets reset when category changes
  }, [selectedCategory]);

  const handleChipClick = (item: string) => {
    if (item === "ALL") {
      setSelectedItem("ALL");
      onSelect(null); // Always show all data when ALL is clicked
    } else if (selectedItem === item) {
      // Deselect chip and show all
      setSelectedItem("ALL");
      onSelect(null);
    } else {
      setSelectedItem(item);
      onSelect([item]);
    }
  };

  return (
    <Box display="flex" gap={1} flexWrap="wrap">
      <Chip
        avatar={
          <Avatar sx={{ bgcolor: categoryColors[selectedCategory] || "primary.main", width: 32, height: 32 }}>
            <AssignmentIcon fontSize="small" sx={{ color: "white" }} />
          </Avatar>
        }
        label="ALL"
        color={selectedItem === "ALL" ? "secondary" : categoryColors[selectedCategory]}
        onClick={() => handleChipClick("ALL")}
        clickable
      />
      {items.map((item, index) => (
        <Chip
          avatar={
            <Avatar sx={{ bgcolor: categoryColors[selectedCategory] || "primary.main", width: 32, height: 32 }}>
              <AssignmentIcon fontSize="small" sx={{ color: "white" }} />
            </Avatar>
          }
          key={index}
          label={item}
          color={selectedItem === item ? "secondary" : categoryColors[selectedCategory]}
          onClick={() => handleChipClick(item)}
          clickable
        />
      ))}
    </Box>
  );
};

export default FilterChip;
