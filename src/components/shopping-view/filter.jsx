/* eslint-disable react/prop-types */
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllCategories } from "@/store/admin/category-slice";
import { fetchAllBrands } from "@/store/admin/brand-slice";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function ProductFilter({
  filters,
  handleFilter,
  currentCategory,
  clearFilter,
}) {
  const { categoryList } = useSelector((state) => state.shopCategory);
  const { brandList } = useSelector((state) => state.shopBrand);
  const [expandedSections, setExpandedSections] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  useEffect(() => {
    if (currentCategory && categoryList && categoryList.length > 0) {
      const foundCategory = categoryList.find(
        (cat) => cat._id === currentCategory._id || cat._id === currentCategory,
      );

      if (
        foundCategory &&
        (!filters?.category || !filters.category.includes(foundCategory._id))
      ) {
        setTimeout(() => {
          handleFilter("category", foundCategory._id);
        }, 100);
      }
    }
  }, [currentCategory]);

  const filterOptions = {
    category: categoryList.map((categoryItem) => ({
      id: categoryItem._id,
      label: categoryItem.title,
      isSelected:
        currentCategory &&
        (categoryItem._id === currentCategory._id ||
          categoryItem._id === currentCategory ||
          (currentCategory._id && categoryItem._id === currentCategory._id)),
    })),
    brand: brandList.map((brandItem) => ({
      id: brandItem._id,
      label: brandItem.title,
    })),
    colours: [
      { id: "black", label: "Black" },
      { id: "white", label: "White" },
      { id: "red", label: "Red" },
      { id: "green", label: "Green" },
      { id: "yellow", label: "Yellow" },
      { id: "blue", label: "Blue" },
      { id: "brown", label: "Brown" },
      { id: "orange", label: "Orange" },
      { id: "pink", label: "Pink" },
      { id: "purple", label: "Purple" },
      { id: "gray", label: "Gray" },
      { id: "silver", label: "Silver" },
      { id: "beige", label: "Beige" },
      { id: "cream", label: "Cream" },
      { id: "aqua", label: "Aqua" },
      { id: "maroon", label: "Maroon" },
    ],
    size: [
      { id: "xs", label: "XS" },
      { id: "s", label: "S" },
      { id: "m", label: "M" },
      { id: "l", label: "L" },
      { id: "xl", label: "XL" },
      { id: "2xl", label: "2XL" },
      { id: "3xl", label: "3XL" },
      { id: "4xl", label: "4XL" },
      { id: "5xl", label: "5XL" },
      { id: "6xl", label: "6XL" },
      { id: "2", label: "2" },
      { id: "3", label: "3" },
      { id: "4", label: "4" },
      { id: "5", label: "5" },
      { id: "4.5", label: "4.5" },
      { id: "6", label: "6" },
      { id: "6.5", label: "6.5" },
      { id: "7", label: "7" },
      { id: "7.5", label: "7.5" },
      { id: "8", label: "8" },
      { id: "8.5", label: "8.5" },
      { id: "9", label: "9" },
      { id: "9.5", label: "9.5" },
      { id: "10", label: "10" },
      { id: "10.5", label: "10.5" },
      { id: "11", label: "11" },
      { id: "11.5", label: "11.5" },
      { id: "12", label: "12" },
      { id: "13", label: "13" },
      { id: "14", label: "14" },
      { id: "15", label: "15" },
      { id: "37", label: "37" },
      { id: "37.5", label: "37.5" },
      { id: "38", label: "38" },
      { id: "39", label: "39" },
      { id: "40", label: "40" },
      { id: "41", label: "41" },
      { id: "42", label: "12.5" },
      { id: "43", label: "43" },
      { id: "44", label: "44" },
      { id: "45", label: "45" },
      { id: "46", label: "46" },
    ],
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderFilterOptions = (keyItem, options, isGrid = false) => (
    <Fragment>
      <div>
        <h3 className="text-base font-bold capitalize">{keyItem}</h3>
        <div
          className={`grid ${
            isGrid ? "grid-cols-2" : "grid-cols-1"
          } gap-2 mt-2`}
        >
          {options
            .slice(0, expandedSections[keyItem] ? options.length : 10)
            .map((option, index) => (
              <Label
                key={index}
                className={`flex font-medium items-center gap-2 ${
                  option.isSelected ? "text-primary font-bold" : ""
                }`}
              >
                <Checkbox
                  checked={filters && filters[keyItem]?.includes(option.id)}
                  onCheckedChange={() => handleFilter(keyItem, option.id)}
                />
                {option.label}
              </Label>
            ))}
        </div>
        {options.length > 10 && (
          <p
            onClick={() => toggleSection(keyItem)}
            className="flex text-blue-500 underline cursor-pointer justify-end text-xs mt-1"
          >
            {expandedSections[keyItem] ? "Show less" : "Show more"}
          </p>
        )}
      </div>
      <Separator />
    </Fragment>
  );

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {renderFilterOptions("category", filterOptions.category)}
        {renderFilterOptions("brand", filterOptions.brand)}
        {renderFilterOptions("colours", filterOptions.colours, true)}
        {renderFilterOptions("size", filterOptions.size, true)}
      </div>
      <Button variant="outline" onClick={clearFilter} className="w-full mt-4">
        Clear All Filters
      </Button>
    </div>
  );
}

export default ProductFilter;
