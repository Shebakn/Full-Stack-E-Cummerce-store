import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FiUser, FiSearch } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa6";
import { useMediaQuery } from '@mui/material';

// Import Custom Components
import logo from '@/assets/imgs/logo.png';
import CountryDropdown from './components/CountryDropdown';
import SearchBar from './components/SearchBar'; 

// Import stores
import { useCategories } from './hooks/category.hook';
import type { Category } from "@/store/category.store";

import './styles.css';

const Header = () => {

    const { categories, isLoading } = useCategories();

    // تحديد ما إذا كانت الشاشة جوال (أقل من 768 بكسل)
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <header className="headerWrapper">
            {/* الشريط العلوي للإشعارات */}
            <div className="top-strip bg-purple">
                <div className="container">
                    <p className="mb-0 mt-0 text-center">
                        Due to the <b>COVID 19</b> epidemic, orders may be processed with a slight delay
                    </p>
                </div>
            </div>

            {/* الهيدر الرئيسي (اللوجو، البحث، الحساب، السلة) */}
            <div className="header">
                <div className="container">
                    <div className={`row d-flex align-items-center ${isMobile ? 'justify-content-between' : ''}`}>
                        
                        {/* قسم اللوجو */}
                        <div className={isMobile ? "col-4 logoWrapper" : "col-sm-2 logoWrapper"}>
                            <Link to="/">
                                <img src={logo} alt="Shopify Logo" />
                            </Link>
                        </div>

                        {/* قسم البحث والعناصر التفاعلية */}
                        <div className={isMobile ? "col-8 d-flex align-items-center justify-content-end part2" : "col-sm-10 d-flex align-items-center part2"}>
                            
                            {/* يظهر فقط في الشاشات الكبيرة */}
                            {!isMobile && <CountryDropdown />}
                            {!isMobile && <SearchBar />}
                                                        
                            {/* أيقونات المستخدم والسلة */}
                            <div className={`d-flex align-items-center part3 ${isMobile ? 'mobile-gap' : 'ms-auto'}`}>

    {isMobile && (
        <Button className="circle">
            <FiSearch />
        </Button>
    )}

    <Button className="circle">
        <FiUser />
    </Button>

    <div className="cartTab">
        <div className="position-relative">
            <Button className="circle">
                <IoBagOutline />
            </Button>
            <span className="count">0</span>
        </div>
    </div>

    {isMobile && (
        <Button className="circle">
            <RiMenu2Line />
        </Button>
    )}
</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* شريط التنقل السفلي */}
            <nav className="nav">
                <div className="container">
                    <div className="row align-items-center">

                        {/* زر جميع الأقسام (يختفي في الموبايل) */}
                        {!isMobile && (
                        <div className="col-sm-3 navPart1">
                            <Button className="allCatTab d-flex align-items-center">
                                <span className="icon1 me-2">
                                    <RiMenu2Line />
                                </span>

                                <span className="text">
                                    ALL CATEGORIES
                                </span>

                                <span className="icon2 ms-auto">
                                    <FaAngleDown />
                                </span>
                            </Button>
                        </div>
                    )}

                        {/* روابط التنقل (تتحول لشريط قابل للسحب في الموبايل) */}
                        <div className={!isMobile ? "col-sm-9 navPart2" : "col-12 navPart2"}>
                            <div className="navLinksWrapper">
                                <ul className="navLinks d-flex align-items-center mb-0">


  {/* Categories من API */}
  {isLoading ? (
  Array.from({ length: 6 }).map((_, i) => (
    <li key={i}>
      <div className="navSkeleton"></div>
    </li>
  ))
) : (
  <>
    <li>
      <Link to="/">HOME</Link>
    </li>

    {categories.map((cat: Category) => (
      <li key={cat.id}>
        <Link to={`/shop?categoryId=${cat.id}`}>
          {cat.name.toUpperCase()}
        </Link>
      </li>
    ))}
  </>
)}

</ul>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;