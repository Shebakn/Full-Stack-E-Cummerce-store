
import Button from '@mui/material/Button';
import { IoSearch } from "react-icons/io5";

export const SearchBar = () => {
    return (
        <div className="headerSearch d-flex align-items-center">
            <input type="text" placeholder="Search for products..." />
            <Button aria-label="Search">
                <IoSearch />
            </Button>
        </div>
        
    );
};

export default SearchBar;