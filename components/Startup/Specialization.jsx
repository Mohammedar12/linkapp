import { useEffect, useState } from "react";
import OpenAI from "openai";
import axios from "axios";
import os from "os";

import {
  FaBusinessTime,
  FaPaintBrush,
  FaBook,
  FaFilm,
  FaTshirt,
  FaUtensils,
  FaBalanceScale,
  FaHeartbeat,
  FaHandsHelping,
  FaPuzzlePiece,
  FaLaptop,
  FaPlane,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";

const MainCategory = ({ categories, selectedCategory, onCategoryClick }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(categories).map((category, index) => (
        <button
          key={index}
          className={`category bg-secondary-foreground px-4 text-secondary py-2 rounded-md hover:bg-primary  flex items-center 
            gap-2 ${
              selectedCategory?.category === category
                ? "!bg-primary text-secondary"
                : ""
            }`}
          onClick={() => {
            onCategoryClick(category);
          }}
        >
          {categories[category].icon}
          {category}
        </button>
      ))}
    </div>
  );
};
const SubCategory = ({
  subcategories,
  onSubCategoryClick,
  selectedCategory,
  selectedSubCategory,
}) => {
  return (
    <div className="my-4 sub-categories">
      <h3 className="mb-2 text-lg font-semibold">
        Pick your {selectedCategory?.category} category (optional):
      </h3>
      <div className="flex flex-wrap gap-2">
        {subcategories.map((subcategory, index) => (
          <button
            key={index}
            className={`subcategory bg-secondary-foreground text-secondary px-4 py-2 rounded-md hover:bg-primary ${
              selectedSubCategory === subcategory
                ? "!bg-primary text-secondary"
                : ""
            }`}
            onClick={() => {
              onSubCategoryClick(subcategory);
              console.log(selectedSubCategory, subcategory);
            }}
          >
            {subcategory}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function Content(props) {
  const {
    genreate,
    selectedCategory,
    selectedSubCategory,
    setSelectedCategory,
    setSelectedSubCategory,
    nextStep,
    prevStep,
  } = props;

  const categories = {
    Business: {
      icon: <FaBusinessTime />,
      subcategories: [
        "Agency & Consulting",
        "Automobiles",
        "Crafts",
        "Financial Services",
        "Home Improvement & Maintenance",
        "HR & Recruiting",
        "Legal Services",
        "Marketing & Advertising",
        "Public Relations",
        "Real Estate",
        "Recreation",
        "Shopping & Retail",
        "Startup",
        "Venture Capital",
        "Weddings",
      ],
    },
    Creative: {
      icon: <FaPaintBrush />,
      subcategories: [
        "Adult",
        "Cosplay",
        "Crafts",
        "Designer",
        "Digital Creator",
        "Influencer",
        "Model",
        "Visual Arts",
        "Writer",
      ],
    },
    Education: {
      icon: <FaBook />,
      subcategories: [
        "campus-organizations",
        "schools-&-universities",
        "E-learning",
      ],
    },
    Entertainment: {
      icon: <FaFilm />,
      subcategories: [
        "Actor",
        "Comedy",
        "Dance & Theatre",
        "Film & TV",
        "Gaming & Esports",
        "Live Events",
        "Music",
        "Performance Art",
        "Publications & Digital Media",
        "Radio & Podcasts",
        "Sports",
        "Talent Agency",
        "Talent Management",
      ],
    },
    FashionBeauty: {
      icon: <FaTshirt />,
      subcategories: [
        "Clothing & Accessories",
        "Fragrances",
        "Hair Care",
        "Jewelry",
        "Makeup & Skincare",
        "Nail Care",
        "Shoes",
        "Tattoos & Piercings",
      ],
    },
    FoodBeverage: {
      icon: <FaUtensils />,
      subcategories: [
        "Alcohol",
        "Bars & Restaurants",
        "Chef",
        "Coffee & Tea",
        "Desserts",
        "Groceries",
        "Home Cooking",
      ],
    },
    GovernmentPolitics: {
      icon: <FaBalanceScale />,
      subcategories: [
        "Activism",
        "Countries & Municipalities",
        "Emergency Services",
        "Judiciary",
        "Law Enforcement",
        "Library",
        "Military & Veterans",
        "Policy",
        "Politicians & Campaigns",
        "Public Services",
      ],
    },
    HealthWellness: {
      icon: <FaHeartbeat />,
      subcategories: [
        "Cannabis",
        "Fitness",
        "Life Coaching",
        "Healthcare",
        "Nutrition",
        "Retreats & Spa",
        "Spirituality",
      ],
    },
    Other: {
      icon: <FaPuzzlePiece />,
      subcategories: [
        "Adult Cosplay",
        "Affiliate Marketing",
        "Contests & Giveaways",
        "Crowdfunding",
        "Electronic Press Kit",
        "Fan Club",
        "Memes",
        "Personal",
        "Pets",
        "Portfolio",
        "Public Figure",
        "Religion",
        "Not Listed",
      ],
    },
    Tech: {
      icon: <FaLaptop />,
      subcategories: [
        "Edutech",
        "Fintech",
        "Hardware Mobile App",
        "SaaS",
        "Social Media",
      ],
    },
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory({
      category: category,
      sub: categories[category].subcategories,
    });
    setSelectedSubCategory(null); // Reset subcategory selection when a new category is selected
  };

  const handleSubCategoryClick = (subcategory) => {
    setSelectedSubCategory(subcategory);
  };

  return (
    <div className="main-categories my-4 max-w-[60%] ">
      <h2 className="mb-2 text-lg font-semibold">
        Select one category that best describes your Linktree:
      </h2>
      <MainCategory
        selectedCategory={selectedCategory}
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />

      {selectedCategory && (
        <SubCategory
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          subcategories={selectedCategory.sub}
          onSubCategoryClick={handleSubCategoryClick}
        />
      )}
      <div className="flex items-center my-6">
        <Button
          className="text-white bg-primary hover:bg-primary/90"
          variant="outline"
          onClick={() => {
            genreate();
            nextStep();
          }}
          disabled={!selectedCategory}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
