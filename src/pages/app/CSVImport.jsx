import React, { useCallback, useEffect, useState, useContext } from "react";
import { FiLoader, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import Cookies from "js-cookie";
import _ from "lodash";

import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { AppContext } from "../../context/AppContext";
import CsvProductContainer from "../../components/app/csvimport/CsvProductContainer";
import { convertEpochToTimeObject } from "../../utils/helper";

const CSVImport = ({ setIsCSV, products, setProducts, setUpdate }) => {
  const navigate = useNavigate();

  // Handle input change

  const [loading, setLoading] = useState(false);

  const { latitude, longitude } = useContext(AppContext);

  const [files, setFiles] = useState([]);

  const [isAddNew, setIsAddNew] = useState(false);

  const store = Cookies.get("store") ? JSON.parse(Cookies.get("store")) : null;

  const [cover, setCover] = useState(0);

  const [categories, setCategories] = useState([]); // Updated variable name to camelCase
  const [categoryLoading, setCategoryLoading] = useState(false);

  const getCategories = async () => {
    try {
      setCategoryLoading(true);
      const { data } = await axios.get(`/category`);
      setCategories(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    

    getCategories();
  }, []);

  const checkForFieldErrors = (array) => {
    const requiredFields = [
      "name",
      "description",
      "quantity",
      "pricePerDay",
      "pricePerHour",
      "availableDays",
      "pickupTime",
      "categoryId",
      "subCategoryId",
      "dropOffTime",
      "pickupAddress",
    ];

    // Array to store error details
    const errors = [];

    // Iterate through each object in the array
    array.forEach((item, index) => {
      const missingFields = [];

      // Check each required field
      requiredFields.forEach((field) => {
        // Check if the field is missing or invalid (empty string, null, undefined, or empty array)
        if (
          !item[field] ||
          item[field] === "" ||
          item[field] === null ||
          (Array.isArray(item[field]) && item[field].length === 0)
        ) {
          missingFields.push(field); // Add the field name to the missingFields array
        }
      });

      // If there are missing fields, store the index and fields
      if (missingFields.length > 0) {
        errors.push({ index, missingFields });
      }
    });

    return errors;
  };

  const [errorObj, setErrorObj] = useState([]);
  const [multipleLoading, setMultipleLoading] = useState(false);

  const handleRemoveBeforeIndex = (index) => {
    const filteredData = products?.filter((item, idx) => idx >= index);

    // Use a fresh array to update the state
    setProducts([...filteredData]);
  };

  const sendData = async (e) => {
    e.preventDefault();
    try {
      setMultipleLoading(true); // Ensure this is being triggered
      if (checkForFieldErrors(products)?.length > 0) {
        setErrorObj(checkForFieldErrors(products));
        setMultipleLoading(false); // Reset loading status here too
      } else {
        setErrorObj([]);

        const response = await axios.post(`/product/multiple`, {
          products: products.map((item) => ({
            name: item.name || "",
            description: item.description || "",
            quantity: item.quantity || "",
            categoryId: item?.categoryId,
            subCategoryId: item?.subCategoryId,
            availableDays:
              JSON.stringify(item?.availableDays) || JSON.stringify([]),
            pickupTime: item.pickupTime || "",
            dropOffTime: item.dropOffTime || "",
            cover: item?.cover || null,
            pickupAddress: item?.pickupAddress || "",
            pricePerHour: item?.pricePerHour || "",
            pricePerDay: item?.pricePerDay || "",
            latitude: item?.latitude || null,
            longitude: item?.longitude || null,
          })),
        });

        if (response?.data?.success) {
          setUpdate((prev) => !prev);
          setIsCSV(false);
          setProducts([]);
        }
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Something went wrong.");
      let index = error?.response?.data?.index;
      if (index !== null && index !== undefined && index > 0) {
        handleRemoveBeforeIndex(index);
      }
    } finally {
      setMultipleLoading(false); // This will turn off the loading spinner
    }
  };

  const handleUpdate = (id, updatedFields) => {
    setProducts((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, ...updatedFields } : item
      )
    );
  };

  return (
    <form
      onSubmit={(e) => {
        sendData(e);
      }}
      className="w-full h-full  flex flex-col  py-4 px-2 lg:px-6 justify-start items-start gap-6"
    >
      <div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
        <div className="w-full relative flex flex-col lg:flex-row justify-between lg:items-center">
          <span className="text-[32px] font-bold leading-[48px] text-[#202224]">
            Products
          </span>
          <div className="w-auto flex flex-wrap lg:flex-nowrap justify-end lg:justify-start items-center gap-3">
            {/* <div className="relative w-full lg:w-[256px] bg-white h-[49px] flex items-start justify-start rounded-[8px] border border-gray-300">
              <span className="w-[40px] h-full flex items-center justify-center ">
                <FiSearch className="  text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleInputChange}
                className="    text-sm text-gray-700 focus:outline-none w-[calc(100%-40px)] h-full rounded-r-[8px]" // Increased size
              />
            </div> */}

            <button
              type="submit"
              className="w-[150px] h-[49px] rounded-[8px] bg-[#F85E00] text-white flex gap-2 items-center justify-center"
            >
              <span className="text-[14px] font-normal leading-[21px] ">
                Save
              </span>
              {multipleLoading && (
                <FiLoader className="animate-spin text-lg " />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6  justify-start items-start">
        {products?.map((product, key) => {
          return (
            <CsvProductContainer
              key={product?._id || key} // Use a unique identifier like `id`
              number={key}
              product={product}
              setProducts={setProducts}
              categories={categories}
              onUpdate={handleUpdate}
              errorObj={errorObj}
            />
          );
        })}
      </div>
    </form>
  );
};

export default CSVImport;
