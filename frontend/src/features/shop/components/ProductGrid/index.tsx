import React from "react";
import { Row, Col } from "react-bootstrap";
import { Rating } from "@mui/material";
import './sytles.css';
import { Link } from "react-router-dom";

/* ================= TYPES ================= */
type Product = {
  id: string | number;
  title?: string;
  name?: string;
  price: number;
  oldPrice?: number;
  image?: string;
  imageCover?: {
    small?: string;
  };
  category?: {
    name?: string;
  };
  ratingsAverage?: number;
  ratingsQuantity?: number;
};

type Props = {
  products: Product[];
  loading?: boolean;
};

/* ================= SKELETON ================= */
const ProductCardSkeleton = () => {
  return (
    <div className="productItem skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-category" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-title short" />
      <div className="skeleton skeleton-btn" />
    </div>
  );
};

/* ================= COMPONENT ================= */
const ProductGrid: React.FC<Props> = ({ products, loading = false }) => {
  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Row className="g-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Col key={i} xs={6} sm={6} md={6} lg={4} xl={4}>
            <ProductCardSkeleton />
          </Col>
        ))}
      </Row>
    );
  }

  /* ================= EMPTY ================= */
  if (!products || products.length === 0) {
    return (
      <div className="text-center w-100 py-5">
        No products found
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <Row className="g-4">
      {products.map((product) => (
  <Col key={product.id} xs={6} sm={6} md={6} lg={4} xl={4}>
    <div className="productItem h-100 d-flex flex-column">

      {/* جعل الصورة قابلة للضغط */}
      <Link to={`/product/${product.id}`} className="imgWrapper">
        <img
          src={
            product.imageCover?.small ||
            product.image ||
            "https://via.placeholder.com/200"
          }
          alt={product.title || product.name}
          loading="lazy"
        />
      </Link>

      <span className="productCategory">
        {product.category?.name || "General"}
      </span>

      {/* جعل العنوان قابل للضغط */}
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h6 className="productTitle">
          {product.title || product.name}
        </h6>
      </Link>

      <div className="reviewSection">
        <Rating
          value={product.ratingsAverage || 0}
          precision={0.5}
          readOnly
          size="small"
        />
        <span className="reviewCount">
          ({product.ratingsQuantity || 0} Reviews)
        </span>
      </div>

      <div className="price-section mt-auto">
        <span className="price">${product.price}</span>
        {product.oldPrice && (
          <del className="ms-2 text-muted small">
            ${product.oldPrice}
          </del>
        )}
      </div>

      <Link to={`/product/${product.id}`}>
        <button className="btn-add">
        View Details
      </button>
      </Link>
      

    </div>
  </Col>
))}
    </Row>
  );
};

export default ProductGrid;