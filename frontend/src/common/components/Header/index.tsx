import React from 'react';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { FiUser, FiSearch, FiHeart } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa6";
import { useMediaQuery } from '@mui/material';

// Components
import logo from '@/assets/imgs/logo.png';
import CountryDropdown from './components/CountryDropdown';
import SearchBar from './components/SearchBar';

// Hooks
import { useCategories } from '@/common/hooks/category.hook';
import type { Category } from '@/common/types/category.type';
import { useAuthUser } from '@/features/auth/hooks/auth-user';
import { useCountries } from "@/common/hooks/country.hook";
import { useCart } from '@/features/cart/hooks/cart.hook';

import './styles.css';
import { getSelectedCountry, setSelectedCountry } from '../../utils/country-storage';

const Header = () => {
    const { isAuthenticated } = useAuthUser();

    const { categories, isLoading: isCategoriesLoading } = useCategories();
    const { countries, isLoading: isCountriesLoading } = useCountries();

    // 🔥 الكارت الآن يعتمد على enabled داخل الهوك
    const { data, isLoading } = useCart();
    const cart = data?.data;
    const items = cart?.items || [];

    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <header className="headerWrapper">

            {/* Top Strip */}
            <div className="top-strip bg-purple">
                <div className="container">
                    <p className="mb-0 mt-0 text-center">
                        Due to the <b>COVID 19</b> epidemic, orders may be processed with a slight delay
                    </p>
                </div>
            </div>

            {/* Main Header */}
            <div className="header">
                <div className="container">
                    <div className={`row d-flex align-items-center ${isMobile ? 'justify-content-between' : ''}`}>

                        {/* Logo */}
                        <div className={isMobile ? "col-4 logoWrapper" : "col-sm-2 logoWrapper"}>
                            <Link to="/">
                                <img src={logo} alt="Shopify Logo" />
                            </Link>
                        </div>

                        {/* Right Section */}
                        <div className={isMobile ? "col-8 d-flex align-items-center justify-content-end part2" : "col-sm-10 d-flex align-items-center part2"}>

                            {!isMobile && (
                                <CountryDropdown
                                    countries={countries || []}
                                    loading={isCountriesLoading} // ✅ fix
                                    selectedCountry={getSelectedCountry()}
                                    onSelectCountry={setSelectedCountry}
                                />
                            )}

                            {!isMobile && <SearchBar />}

                            <div className={`d-flex align-items-center part3 ${isMobile ? 'mobile-gap' : 'ms-auto'}`}>

                                {/* Mobile Search */}
                                {isMobile && (
                                    <Button className="circle">
                                        <FiSearch />
                                    </Button>
                                )}

                                {isAuthenticated ? (
                                    <>
                                        {/* Favorites */}
                                        <Button className="circle">
                                            <FiHeart />
                                        </Button>

                                        {/* Cart */}
                                        <Link to="/cart">
                                        <div className="cartTab">
                                            <div className="position-relative">
                                                <Button className="circle">
                                                    <IoBagOutline />
                                                </Button>

                                                
                                                    <span className="count">
                                                        {isLoading ? "-" : items.length || 0}
                                                    </span>
                                                
                                            </div>
                                        </div>
                                        </Link>

                                        {/* Profile (desktop only) */}
                                        {!isMobile && (
                                            <Button className="circle ms-2">
                                                <FiUser />
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {isMobile ? (
                                            <Link to="/login">
                                                <Button className="circle">
                                                    <FiUser />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <div className="authLinks d-flex align-items-center">
                                                <Link to="/login" className="link">Login</Link>
                                                <span className="mx-2 text-secondary">|</span>
                                                <Link to="/register" className="link">Register</Link>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="nav">
                <div className="container">
                    <div className="row align-items-center">

                        {!isMobile && (
                            <div className="col-sm-3 navPart1">
                                <Button className="allCatTab d-flex align-items-center">
                                    <span className="icon1 me-2"><RiMenu2Line /></span>
                                    <span className="text">ALL CATEGORIES</span>
                                    <span className="icon2 ms-auto"><FaAngleDown /></span>
                                </Button>
                            </div>
                        )}

                        <div className={!isMobile ? "col-sm-9 navPart2" : "col-12 navPart2"}>
                            <div className="navLinksWrapper">
                                <ul className="navLinks d-flex align-items-center mb-0">

                                    {isCategoriesLoading ? (
                                        Array.from({ length: 6 }).map((_, i) => (
                                            <li key={i}><div className="navSkeleton"></div></li>
                                        ))
                                    ) : (
                                        <>
                                            <li><Link to="/">HOME</Link></li>

                                            {categories?.map((cat: Category) => (
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