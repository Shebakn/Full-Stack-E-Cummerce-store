import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { Container, Row, Col, Alert } from "react-bootstrap";
import { Rating, Skeleton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";

import {
  FiShoppingCart,
  FiHeart,
  FiMinus,
  FiPlus,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useProduct, useSubmitReview } from "@/features/product/hooks/product.hook";
import { useProductUIStore } from "@/features/product/stores/product.store";
import type { Product } from "../types/product.types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import "./styles.css";

/* ================= COMPONENT ================= */

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // Local state for thumbs swiper
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  
  // Local state for review form
  const [userRating, setUserRating] = useState<number | null>(0);
  const [userReview, setUserReview] = useState("");

  // React Query
  const { data: product, isLoading, error } = useProduct(id);
  const submitReviewMutation = useSubmitReview();

  // Zustand UI Store
  const {
    selectedVariant,
    quantity,
    activeTab,
    setVariant,
    setQuantity,
    setTab,
    reset,
  } = useProductUIStore();

  /* ================= RESET ON PRODUCT CHANGE ================= */
  useEffect(() => {
    reset();
  }, [id, reset]);

  /* ================= IMAGES ================= */
  const images = useMemo(() => {
    if (!product) return [];

    const extra =
      product.images
        ?.sort((a, b) => a.position - b.position)
        .map((img) => img.url.original) || [];

    return [product.imageCover.original, ...extra];
  }, [product]);

  /* ================= VARIANT HELPERS ================= */
  const selected = product?.variants?.find((v) => v.id === selectedVariant);

  const getColor = (variant: Product["variants"][0]) =>
    variant.attributes.find((a) => a.name === "color")?.value;

  const getSize = (variant: Product["variants"][0]) =>
    variant.attributes.find((a) => a.name === "size")?.value;

  const currentPrice = selected
    ? parseFloat(selected.price)
    : product?.price || 0;
    
  const currentStock = selected
    ? selected.stock
    : product?.variants?.[0]?.stock || 0;

  /* ================= ADD TO CART ================= */
  const handleAddToCart = () => {
    if (!selectedVariant && product?.variants?.length) {
      toast.error("Please select a variant first");
      return;
    }

    if (currentStock === 0) {
      toast.error("Out of stock");
      return;
    }

    if (quantity > currentStock) {
      toast.error(`Only ${currentStock} items available`);
      return;
    }

    // TODO: Add to cart logic here
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  /* ================= SUBMIT REVIEW ================= */
  const handleSubmitReview = async () => {
    if (!userRating || userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!userReview.trim()) {
      toast.error("Please write your review");
      return;
    }

    if (!id) return;

    submitReviewMutation.mutate(
      {
        productId: id,
        rating: userRating,
        reviewText: userReview,
      },
      {
        onSuccess: () => {
          // Reset form
          setUserRating(0);
          setUserReview("");
          // Switch to reviews tab
          setTab("reviews");
        },
      }
    );
  };

  /* ================= LOADING STATE ================= */
  if (isLoading) {
    return (
      <Container className="mt-5">
        <Row>
          <Col md={5}>
            <Skeleton variant="rectangular" height={400} />
          </Col>
          <Col md={7}>
            <Skeleton width="60%" height={40} />
            <Skeleton width="40%" />
            <Skeleton width="80%" />
            <Skeleton height={100} />
          </Col>
        </Row>
      </Container>
    );
  }

  /* ================= ERROR STATE ================= */
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error loading product</Alert.Heading>
          <p>{(error as any)?.message || "Something went wrong"}</p>
        </Alert>
      </Container>
    );
  }

  if (!product) return null;

  /* ================= RENDER ================= */
  return (
    <div className="productDetails">
      <Container>
        <Row>
          {/* ================= IMAGES SECTION ================= */}
          <Col md={5}>
            <div className="main-swiper-wrapper">
              <Swiper
                modules={[Navigation, Thumbs]}
                slidesPerView={1}
                thumbs={{ swiper: thumbsSwiper }}
                navigation
                className="mainSwiper"
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <Zoom>
                      <img src={img} alt={`product ${i + 1}`} />
                    </Zoom>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {images.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={10}
                className="thumbSwiper mt-3"
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img src={img} alt={`thumb ${i + 1}`} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Col>

          {/* ================= PRODUCT DETAILS SECTION ================= */}
          <Col md={7}>
            <h4 className="productTitle mt-4 mt-md-0">{product.title}</h4>

            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-muted small">
                Brand: {product.brand?.name || "N/A"}
              </span>

              <Rating
                value={product.ratingsAverage || 0}
                readOnly
                size="small"
                precision={0.5}
              />

              <button
                className="reviewLink"
                onClick={() => setTab("reviews")}
              >
                ({product.reviewsCount} Reviews)
              </button>
            </div>

            {/* PRICE */}
            <div className="priceBox mb-2">
              <span className="price">${currentPrice.toFixed(2)}</span>

              <span
                className={`stock ${
                  currentStock === 0 ? "out-of-stock" : ""
                }`}
              >
                {currentStock > 0
                  ? `In Stock (${currentStock})`
                  : "Out of stock"}
              </span>
            </div>

            <p className="desc">{product.description}</p>

            {/* VARIANTS SECTION */}
            {product.variants?.length > 0 && (
              <div className="variantsSection">
                <h6 className="variantTitle mb-2">
                  Available Variants{" "}
                  {!selectedVariant && (
                    <span className="required-star">*</span>
                  )}
                </h6>

                <div className="variants-grid">
                  {product.variants.map((item) => (
                    <div
                      key={item.id}
                      className={`variantCard ${
                        selectedVariant === item.id ? "active" : ""
                      } ${item.stock === 0 ? "disabled" : ""}`}
                      onClick={() =>
                        item.stock > 0 && setVariant(item.id)
                      }
                    >
                      <div className="variantColorWrapper">
                        <span
                          className="variantColor"
                          style={{
                            backgroundColor:
                              getColor(item)?.toLowerCase() || "#ccc",
                          }}
                        />
                      </div>

                      <div className="variantInfo">
                        <span className="variantSize">
                          {getSize(item)}
                        </span>
                        <span className="variantPrice">
                          ${parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>

                      {item.stock === 0 && (
                        <span className="variantOutOfStock">Out</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIONS SECTION */}
            <div className="product-actions-container mt-4">
              <div className="actions-wrapper">
                <div className="quantity-control">
                  <button
                    onClick={() =>
                      setQuantity(Math.max(1, quantity - 1))
                    }
                    className="qty-btn"
                    disabled={currentStock === 0}
                  >
                    <FiMinus />
                  </button>

                  <span className="qty-value">{quantity}</span>

                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(currentStock, quantity + 1)
                      )
                    }
                    className="qty-btn"
                    disabled={
                      currentStock === 0 || quantity >= currentStock
                    }
                  >
                    <FiPlus />
                  </button>
                </div>

                <button
                  className="main-action-btn"
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                >
                  <FiShoppingCart />
                  <span>
                    {currentStock === 0 ? "Out of Stock" : "Add to cart"}
                  </span>
                </button>

                <button className="wishlist-icon-btn">
                  <FiHeart />
                </button>
              </div>
            </div>
          </Col>

          {/* ================= TABS SECTION ================= */}
          <Col xs={12}>
            <div className="product-info-tabs mt-5">
              <ul className="nav nav-tabs border-0">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "description" ? "active" : ""
                    }`}
                    onClick={() => setTab("description")}
                  >
                    Description
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "reviews" ? "active" : ""
                    }`}
                    onClick={() => setTab("reviews")}
                  >
                    Reviews ({product.reviews?.length || 0})
                  </button>
                </li>
              </ul>

              <div className="tab-content border rounded-4 p-4 mt-1">
                {/* DESCRIPTION TAB */}
                <div
                  className={`tab-pane fade ${
                    activeTab === "description" ? "show active" : ""
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>

                {/* REVIEWS TAB */}
                <div
                  className={`tab-pane fade ${
                    activeTab === "reviews" ? "show active" : ""
                  }`}
                >
                  {/* Review Form */}
                  <div className="review-form mb-5">
                    <h5 className="mb-3">Write a Review</h5>

                    <div className="mb-3">
                      <label className="form-label">Your Rating</label>
                      <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`star-icon ${
                              userRating && userRating >= star
                                ? "filled"
                                : ""
                            }`}
                            onClick={() => setUserRating(star)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Your Review</label>
                      <textarea
                        className="form-control review-textarea"
                        rows={4}
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        placeholder="Share your experience with this product..."
                      />
                    </div>

                    <button
                      className="submit-review-btn"
                      onClick={handleSubmitReview}
                      disabled={submitReviewMutation.isPending}
                    >
                      {submitReviewMutation.isPending
                        ? "Submitting..."
                        : "Submit Review"}
                    </button>
                  </div>

                  {/* Reviews List */}
                  <div className="reviews-list">
                    <h5 className="mb-3">
                      Customer Reviews ({product.reviews?.length || 0})
                    </h5>

                    {(!product.reviews || product.reviews.length === 0) && (
                      <Alert variant="info" className="text-center">
                        No reviews yet. Be the first to review this
                        product!
                      </Alert>
                    )}

                    {product.reviews?.map((review) => (
                      <div key={review.id} className="reviewItem">
                        <div className="reviewHeader">
                          <div className="reviewUser">
                            <div className="userAvatar">
                              {review.user?.avatar ? (
                                <img
                                  src={review.user.avatar}
                                  alt={review.user.name}
                                />
                              ) : (
                                <FiUser />
                              )}
                            </div>
                            <div>
                              <strong>
                                {review.user?.name || "Anonymous"}
                              </strong>
                              {review.createdAt && (
                                <div className="reviewDate">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                          <Rating
                            value={review.rating}
                            readOnly
                            size="small"
                          />
                        </div>
                        <p className="reviewText">
                          {review.reviewText || "No comment provided"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetails;