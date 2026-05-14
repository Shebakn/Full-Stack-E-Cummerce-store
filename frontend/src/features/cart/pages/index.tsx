import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  IconButton,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingBag,
  Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";

import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  useApplyCoupon,
  useRemoveCoupon,
} from "../hooks/cart.hook";

import "./styles.css";

const CartSkeleton = () => {
  return (
    <div className="cart-page-main">
      <Container>
        {/* Header */}
        <div className="cart-header-minimal">
          <Skeleton width={200} height={30} />
          <Skeleton width={100} height={20} />
        </div>

        <Row className="gy-4">
          {/* LEFT: ITEMS */}
          <Col lg={8}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="boro-cart-card">
                <div className="product-details">
                  <Skeleton
                    variant="rectangular"
                    width={90}
                    height={90}
                    style={{ borderRadius: 8 }}
                  />

                  <div className="info" style={{ width: "100%" }}>
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="40%" height={15} />
                    <Skeleton width="30%" height={20} />
                  </div>
                </div>

                <div className="actions-section">
                  <Skeleton width={100} height={40} />
                  <Skeleton width={80} height={20} />
                  <Skeleton width={40} height={40} />
                </div>
              </div>
            ))}
          </Col>

          {/* RIGHT: SUMMARY */}
          <Col lg={4}>
            <div className="summary-sticky-card">
              <Skeleton width={150} height={25} />

              <div style={{ marginTop: 15 }}>
                <Skeleton height={40} />
              </div>

              <div style={{ marginTop: 15 }}>
                <Skeleton height={20} />
                <Skeleton height={20} />
                <Skeleton height={20} />
              </div>

              <Skeleton height={50} style={{ marginTop: 20 }} />

              <div style={{ marginTop: 10 }}>
                <Skeleton height={15} />
                <Skeleton height={15} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};


const CartPage = () => {
  const { data, isLoading } = useCart();
  console.log("Cart data:", data);
  
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();
  const applyCouponMutation = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();

  const [coupon, setCoupon] = useState("");

  const cart = data?.data;
  const items = cart?.items || [];

  /* ================= HANDLERS ================= */

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;

    updateMutation.mutate(
      { id, quantity: newQty },
      {
        onError: () => toast.error("Failed to update quantity"),
      }
    );
  };

  const removeItem = (id: string) => {
    removeMutation.mutate(id, {
      onSuccess: () => toast.success("Item removed"),
    });
  };

  const handleApplyCoupon = () => {
    if (!coupon.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    applyCouponMutation.mutate(coupon, {
      onSuccess: () => {
        toast.success("Coupon applied");
        setCoupon("");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Invalid coupon");
      },
    });
  };

  const handleRemoveCoupon = () => {
    removeCouponMutation.mutate(undefined, {
      onSuccess: () => toast.success("Coupon removed"),
    });
  };

  /* ================= TOTALS ================= */

  const subtotal = items.reduce(
    (sum: number, i: any) => sum + i.unitPrice * i.quantity,
    0
  );

  const tax = subtotal * 0.1;
  const discount = cart?.discount || 0;

  const total = subtotal + tax - discount;

  /* ================= LOADING ================= */

  if (isLoading) return <CartSkeleton />;

  /* ================= EMPTY ================= */

  if (items.length === 0) {
    return (
      <div className="cart-empty-state">
        <ShoppingBag sx={{ fontSize: 80, color: "#eee" }} />
        <h2>Your cart is empty</h2>
        <p>Start shopping and add some amazing products</p>
        <Link to="/shop" className="btn-boro-primary">
          Back to shop
        </Link>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="cart-page-main">
      <Container>
        <div className="cart-header-minimal">
          <h1>Shopping Cart ({items.length})</h1>
          <button
            className="clear-all-text"
            onClick={() => clearMutation.mutate()}
          >
            Clear Cart
          </button>
        </div>

        <Row className="gy-4">
          {/* ITEMS */}
          <Col lg={8}>
            {items.map((item: any) => (
              <div key={item.id} className="boro-cart-card">
                <div className="product-details">
                  <div className="img-wrapper">
                    <img
                      src={
                        item.product?.imageCover || "/placeholder.jpg"
                      }
                      alt={item.product?.title}
                    />
                  </div>

                  <div className="info">
                    <Link
                      to={`/products/${item.product?.id}`}
                      className="product-title"
                    >
                      {item.product?.title}
                    </Link>

                    <div className="attributes-row">
                      {item.variant?.attributes?.map((a: any) => (
                        <span key={a.id}>
                          {a.name}: <strong>{a.value}</strong>
                        </span>
                      ))}
                    </div>

                    <span className="unit-price">
                      ${item.unitPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="actions-section">
                  <div className="quantity-stepper">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      disabled={updateMutation.isPending}
                    >
                      <RemoveIcon fontSize="small" />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      disabled={updateMutation.isPending}
                    >
                      <AddIcon fontSize="small" />
                    </button>
                  </div>

                  <div className="item-total-price">
                    $
                    {(item.unitPrice * item.quantity).toFixed(2)}
                  </div>

                  <IconButton
                    className="remove-btn-icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))}
          </Col>

          {/* SUMMARY */}
          <Col lg={4}>
            <div className="summary-sticky-card">
              <h3>Order Summary</h3>

              

              {cart?.coupon && (
                <div className="applied-coupon">
                  <span>Coupon: {cart.coupon.code}</span>
                  <button onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                </div>
              )}

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <hr />

              {/* COUPON */}
              <div className="coupon-box">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />

                <button
                  onClick={handleApplyCoupon}
                  disabled={applyCouponMutation.isPending}
                >
                  {applyCouponMutation.isPending
                    ? "Applying..."
                    : "Apply"}
                </button>
              </div>
              
              <hr />

              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link to="/checkout" className="btn-boro-checkout">
                Checkout
              </Link>

              <div className="trust-badges">
                <p>✓ 100% Secure Payment</p>
                <p>✓ 30-day Easy Returns</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartPage;