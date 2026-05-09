import React, { useEffect } from "react";

import { Container, Row, Col } from "react-bootstrap";

import { useSearchParams } from "react-router-dom";

import CategoryTree from "../components/CategoryTree"; 

import PriceFilter from "../components/PriceFilter"; 

import RatingFilter from "../components/RatingFilter"; 

import OrderByDropdown from "../components/OrderByDropdown"; 

import ProductGrid from "../components/ProductGrid";

import ProductSearchBar from "../components/ProductSearchBar";

import { useProductStore } from "@/features/shop/stores/products.store"; 


import { useProducts } from "@/features/shop/hooks/products.hook"; 

import "./styles.css";
import { useCategories } from "@/features/shop/hooks/categories.hook";

/* ================= PAGINATION ================= */

const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;

  totalPages: number;

  onChange: (p: number) => void;
}) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  return (
    <div className="paginationWrapper">
      <button
        className="pageBtn navBtn"
        disabled={page === 1}
        onClick={() => onChange(1)}
      >
        «
      </button>

      <button
        className="pageBtn navBtn"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`pageBtn numBtn ${
            p === page ? "active" : ""
          }`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="pageBtn navBtn"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>

      <button
        className="pageBtn navBtn"
        disabled={page === totalPages}
        onClick={() => onChange(totalPages)}
      >
        »
      </button>
    </div>
  );
};

/* ================= SHOP ================= */

const Shop = () => {
  const [searchParams] = useSearchParams();

  const { query, setQuery } =
    useProductStore();

  const {
    categories,
    loading: categoriesLoading,
  } = useCategories();
 
  const {
    products,
    meta,
    loading,
  } = useProducts();

  /* ================= INIT ================= */


  /* ================= URL CATEGORY ================= */

  useEffect(() => {
    const categoryFromUrl =
      searchParams.get("categoryId");

    if (categoryFromUrl) {
      setQuery({
        categoryIds: [categoryFromUrl],
      });
    }
  }, [searchParams]);

  /* ================= SEARCH ================= */

  const handleSearch = (
    value: string
  ) => {
    setQuery({
      search: value,

      categoryIds: [],

      minPrice: undefined,

      maxPrice: undefined,

      ratings: [],

      orderBy: "createdAt",

      orderDirection: "desc",
    });
  };

  
  
  return (
    <div className="shopPage mt-4 mb-5">
      <Container>
        <Row className="align-items-start">

          {/* SIDEBAR */}

          <Col
            md={4}
            lg={3}
            className="shopSidebar pe-lg-4"
          >
            <div className="sidebarContent">

              <h6>Categories</h6>

              <CategoryTree
                categories={categories}
                selectedIds={
                  query.categoryIds ?? []
                }
                onChange={(ids) =>
                  setQuery({
                    categoryIds: ids,
                  })
                }
              />

              <hr />

              <PriceFilter
                min={query.minPrice ?? 0}
                max={query.maxPrice ?? 5000}
                onChange={({
                  minPrice,
                  maxPrice,
                }) =>
                  setQuery({
                    minPrice,
                    maxPrice,
                  })
                }
              />

              <hr />

              <RatingFilter
                selected={
                  query.ratings ?? []
                }
                onChange={(ratings) =>
                  setQuery({
                    ratings,
                  })
                }
              />

            </div>
          </Col>

          {/* MAIN */}

          <Col
            md={8}
            lg={9}
            className="shopMain ps-lg-4"
          >

            <div className="mb-4 d-flex gap-3">

              <OrderByDropdown
                value={`${query.orderBy}_${query.orderDirection}`}
                onChange={(val) => {
                  const [
                    orderBy,
                    orderDirection,
                  ] = val.split("_");

                  setQuery({
                    orderBy: orderBy as any,

                    orderDirection:
                      orderDirection as any,
                  });
                }}
              />

              <ProductSearchBar
                value={query.search ?? ""}
                onSearch={handleSearch}
              />

            </div>

            <ProductGrid
              products={products}
              loading={loading}
            />

            <Pagination
              page={meta?.page || 1}
              totalPages={
                meta?.totalPages || 1
              }
              onChange={(page) => {
                setQuery({ page });
              }}
            />

          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default Shop;