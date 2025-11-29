import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Loader from "./Loader";

const SeachAutoComplete = ({
  data = [],
  value = "",
  onChange = () => {},
  onSelect=()=>{},
  isLoading=false,
  openBox =false
}) => {
  const [searchValue, setSearchValue] = useState(value);

  const [debouncedValue] = useDebounce(searchValue, 800);

  const handleSeachChange = (val) => {
    setSearchValue(val);
  };

  useEffect(() => {
    if (debouncedValue || debouncedValue === "") {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  const handleSuggestionClick = (val) => {
    setSearchValue(val);
    onSelect(val)
  };


  return (
    <article className="w-full p-2 border border-gray-200 rounded-full mx-auto flex justify-start items-center relative">
      <input
        type="text"
        className="flex-1"
        value={searchValue}
        placeholder="Search"
        onChange={(e) => handleSeachChange(e.target.value)}
      />
      {
        isLoading && <Loader/>
      }
      <Search className="h-4 w-4" />

      {
       
       openBox && ((data.length > 0) && (
        <section className="w-full absolute top-[calc(100%+10px)] left-0  rounded-md shadow-md border border-gray-300 flex flex-col justify-start items-start max-h-[30vh] overflow-auto">
          {data?.map((item, idx) => (
            <span
              key={item.key}
              className="w-full hover:bg-gray-100 hover:cursor-pointer p-2 border-b last:border-none flex justify-start items-center gap-2"
              onClick={() =>{ handleSuggestionClick(item.value)}}
            >
              <Search className="h-3 w-3" /> {item.value}
            </span>
          ))}
        </section>
      )) 

      }
    </article>
  );
};

export default SeachAutoComplete;
