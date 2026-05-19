// src/modules/checkout/pages/DeliveryLocationPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import {
  Skeleton,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  LocationOn,
  MyLocation,
  Store,
  AccessTime,
  DirectionsCar,
  LocalShipping,
  Security,
  Phone,
  Place,
  Schedule,
  CheckCircle,
  Info,
  Star,
  Navigation,
  WhatsApp,
  Email,
  Wifi,
  LocalParking,
  AccessibilityNew,
  EmojiEmotions,
  ThumbUp,
  Verified,
  DeliveryDining,
  HomeRepairService,
  ChevronRight,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";

import "./styles.css";

import { useSelectedCountry } from "../../../common/hooks/selected-country.hook";
import { useRegions } from "../../../common/hooks/reigon.hook";
import { useDeliveryCenters } from "../hooks/delivery-center.hook";
import CountryDropdown from "../../../common/components/Header/components/CountryDropdown";

/* ================= TYPES ================= */

interface DeliveryCenter {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
  isActive: boolean;
  regionId: string;
  deliveryFee: number;
  etaMinutes: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Region {
  id: string;
  name: string;
  countryId: string;
}

/* ================= SKELETON COMPONENTS ================= */

const DeliverySkeleton = () => {
  return (
    <div className="delivery-page-main">
      <Container>
        <div className="delivery-header">
          <div>
            <Skeleton width={200} height={30} />
            <Skeleton width={250} height={20} style={{ marginTop: 8 }} />
          </div>
          <Skeleton variant="circular" width={40} height={40} />
        </div>

        <Row className="gy-4">
          <Col lg={7}>
            <div className="location-selection-card">
              <Skeleton variant="rectangular" height={50} style={{ marginBottom: 20, borderRadius: 12 }} />
              <Skeleton variant="rectangular" height={50} style={{ marginBottom: 20, borderRadius: 12 }} />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={120} style={{ marginBottom: 15, borderRadius: 16 }} />
              ))}
            </div>
          </Col>
          <Col lg={5}>
            <Skeleton variant="rectangular" height={400} style={{ borderRadius: 20 }} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const CentersSkeleton = () => {
  return (
    <div className="centers-skeleton-container">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-card">
          <Skeleton
            variant="rectangular"
            height={110}
            style={{ marginBottom: 16, borderRadius: 16 }}
          />
        </div>
      ))}
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const DeliveryLocationPage = () => {
  const navigate = useNavigate();

  // =========================
  // COUNTRY
  // =========================
  const { country: selectedCountry } = useSelectedCountry();
  const [openCountryDialog, setOpenCountryDialog] = useState(false);

  // =========================
  // REGION
  // =========================
  const { regions, isLoading: regionsLoading } = useRegions(
    selectedCountry?.id
  );

  const [selectedRegionId, setSelectedRegionId] = useState<string>("");

  // =========================
  // CENTERS (API INTEGRATION)
  // =========================
  const {
    centers,
    isLoading: centersLoading,
  } = useDeliveryCenters(selectedRegionId);

  // =========================
  // STATE
  // =========================
  const [selectedCenter, setSelectedCenter] = useState<DeliveryCenter | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [expandedCenterId, setExpandedCenterId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // =========================
  // LOCATION DETECTION
  // =========================
  const handleUseMyLocation = () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        toast.success("Location detected successfully!");
        setIsLocating(false);
      },
      (error) => {
        console.error("Location error:", error);
        let errorMessage = "Unable to detect your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Please allow location access to use this feature";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        
        toast.error(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // =========================
  // MAP FUNCTIONS
  // =========================
  const openMap = (center: DeliveryCenter) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${center.latitude},${center.longitude}`;
    window.open(url, "_blank");
  };

  const getDirections = (center: DeliveryCenter) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${center.latitude},${center.longitude}`;
      window.open(url, "_blank");
    } else {
      openMap(center);
    }
  };

  // =========================
  // CONTINUE HANDLER
  // =========================
  const handleContinue = () => {
    if (!selectedCenter) {
      toast.error("Please select a pickup center");
      return;
    }

    const pickupInfo = {
      type: "pickup",
      country: selectedCountry,
      region: regions?.find((r: Region) => r.id === selectedRegionId),
      center: {
        id: selectedCenter.id,
        name: selectedCenter.name,
        address: selectedCenter.address,
        latitude: selectedCenter.latitude,
        longitude: selectedCenter.longitude,
        phone: selectedCenter.phone,
        deliveryFee: selectedCenter.deliveryFee,
        etaMinutes: selectedCenter.etaMinutes,
      },
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("pickupInfo", JSON.stringify(pickupInfo));
    toast.success("Pickup location saved successfully!");
    
    navigate("/checkout-payment");
  };

  // =========================
  // FORMAT PHONE
  // =========================
  const formatPhone = (phone: string | null) => {
    if (!phone) return "Not available";
    if (phone.startsWith("+966")) {
      return phone.replace(/(\+966)(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");
    }
    if (phone.startsWith("+967")) {
      return phone.replace(/(\+967)(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
    }
    return phone;
  };

  // =========================
  // CALCULATE DISTANCE (Haversine formula)
  // =========================
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // =========================
  // GET DISTANCE TEXT
  // =========================
  const getDistanceText = (center: DeliveryCenter): string | null => {
    if (!userLocation) return null;
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      center.latitude,
      center.longitude
    );
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  // =========================
  // TOGGLE EXPAND
  // =========================
  const toggleExpand = (centerId: string) => {
    setExpandedCenterId(expandedCenterId === centerId ? null : centerId);
  };

  // =========================
  // ORDER SUMMARY TOTALS
  // =========================
  const subtotal = 250;
  const tax = subtotal * 0.1;
  const deliveryFee = selectedCenter?.deliveryFee || 0;
  const total = subtotal + tax + deliveryFee;

  // =========================
  // EMPTY STATE (NO COUNTRY)
  // =========================
  if (!selectedCountry) {
    return (
      <div className="delivery-empty-state">
        <div className="empty-box">
          <Store style={{ fontSize: 64, color: "#019376", marginBottom: 20 }} />
          <h2>Select Your Country</h2>
          <p>You need to choose a country before continuing</p>

          <button
            className="primary-btn"
            onClick={() => setOpenCountryDialog(true)}
          >
            Choose Country
          </button>

          {/* <CountryDropdown /> */}
        </div>
      </div>
    );
  }

  // =========================
  // LOADING STATE
  // =========================
  if (regionsLoading) {
    return <DeliverySkeleton />;
  }

  // =========================
  // MAIN RENDER
  // =========================
  return (
    <div className="delivery-page-main">
      <Container>
        {/* HEADER */}
        <div className="delivery-header">
          <div>
            <h1>
              <Store style={{ fontSize: 28, marginRight: 10, color: "#019376" }} />
              Select Pickup Location
            </h1>
            <p>Choose the most convenient pickup center for you</p>
          </div>

          <button
            className="use-current-location-btn"
            onClick={handleUseMyLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <>
                <Spinner animation="border" size="sm" />
                Detecting...
              </>
            ) : (
              <>
                <MyLocation />
                Use my location
              </>
            )}
          </button>
        </div>

        <Row className="gy-4">
          {/* LEFT COLUMN - SELECTION */}
          <Col lg={7}>
            <div className="location-selection-card">
              {/* COUNTRY DISPLAY */}
              <div className="form-group-modern">
                <label>
                  <LocationOn className="input-icon" />
                  Country
                </label>
                <div className="selected-country-card">
                  <img
                    src={`https://flagcdn.com/w80/${selectedCountry.code?.toLowerCase()}.png`}
                    alt={selectedCountry.name}
                    className="country-flag"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="country-name">{selectedCountry.name}</span>
                </div>
              </div>

              {/* REGION SELECTION */}
              <div className="form-group-modern">
                <label>
                  <Place className="input-icon" />
                  Region / City
                </label>
                <select
                  value={selectedRegionId}
                  onChange={(e) => {
                    setSelectedRegionId(e.target.value);
                    setSelectedCenter(null);
                    setExpandedCenterId(null);
                  }}
                  className="modern-select"
                >
                  <option value="">Select Region</option>
                  {regions?.map((region: Region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CENTERS LIST */}
              {selectedRegionId && (
                <div className="centers-container">
                  <div className="centers-header">
                    <h4>
                      Available Pickup Centers
                      {centers && centers.length > 0 && (
                        <span className="centers-count">{centers.length}</span>
                      )}
                    </h4>
                    <small>Click on any center to select</small>
                  </div>

                  {centersLoading ? (
                    <CentersSkeleton />
                  ) : centers?.length === 0 ? (
                    <Alert 
                      severity="info" 
                      className="no-centers-alert"
                      icon={<Info />}
                    >
                      No delivery centers available in this region yet.
                    </Alert>
                  ) : (
                    <div className="centers-list">
                      {centers.map((center: DeliveryCenter) => {
                        const isSelected = selectedCenter?.id === center.id;
                        const isExpanded = expandedCenterId === center.id;
                        const distance = getDistanceText(center);

                        return (
                          <div
                            key={center.id}
                            className={`center-card-modern ${isSelected ? "selected" : ""}`}
                          >
                            <div className="center-card-main">
                              <div 
                                className="center-card-content"
                                onClick={() => {
                                  setSelectedCenter(center);
                                  toggleExpand(center.id);
                                }}
                              >
                                <div className="center-header">
                                  <div className="center-name">
                                    <Store style={{ fontSize: 20, color: "#019376" }} />
                                    <strong>{center.name}</strong>
                                    {center.isActive && (
                                      <span className="active-badge">
                                        <CheckCircle style={{ fontSize: 12 }} />
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <div className="center-rating">
                                    <Star style={{ fontSize: 16, color: "#ffc107" }} />
                                    <span>4.8 (245 reviews)</span>
                                  </div>
                                </div>

                                <div className="center-quick-info">
                                  <div className="info-item">
                                    <LocationOn style={{ fontSize: 16 }} />
                                    <span>{center.address || "Address not specified"}</span>
                                  </div>
                                  <div className="info-item">
                                    <AccessTime style={{ fontSize: 16 }} />
                                    <span>ETA: {center.etaMinutes || "N/A"} min</span>
                                  </div>
                                  {distance && (
                                    <div className="info-item distance-info">
                                      <Navigation style={{ fontSize: 16 }} />
                                      <span>{distance}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="center-features">
                                  <div className="feature-tag">
                                    <LocalShipping style={{ fontSize: 14 }} />
                                    <span>Delivery Fee: ${center.deliveryFee}</span>
                                  </div>
                                  <div className="feature-tag">
                                    <Schedule style={{ fontSize: 14 }} />
                                    <span>Pickup: 9AM - 10PM</span>
                                  </div>
                                </div>
                              </div>

                              <Tooltip title="Get Directions" arrow>
                                <button
                                  className="expand-btn"
                                  onClick={() => getDirections(center)}
                                >
                                  <Navigation />
                                </button>
                              </Tooltip>
                            </div>

                            {/* EXPANDED DETAILS */}
                            {isExpanded && (
                              <div className="center-details-expanded">
                                <Divider style={{ margin: "16px 0" }} />
                                <div className="details-grid">
                                  <div className="detail-section">
                                    <h5>Contact Information</h5>
                                    <p>
                                      <Phone style={{ fontSize: 16 }} />
                                      <a href={`tel:${center.phone}`}>
                                        {formatPhone(center.phone)}
                                      </a>
                                    </p>
                                    <p>
                                      <Email style={{ fontSize: 16 }} />
                                      support@{center.name.toLowerCase().replace(/\s/g, "")}.com
                                    </p>
                                    <p>
                                      <WhatsApp style={{ fontSize: 16, color: "#25D366" }} />
                                      <a href={`https://wa.me/${center.phone?.replace(/[^0-9]/g, "")}`}>
                                        Chat on WhatsApp
                                      </a>
                                    </p>
                                  </div>

                                  <div className="detail-section">
                                    <h5>Services & Amenities</h5>
                                    <div className="services-list">
                                      <span className="service-badge">
                                        <Wifi style={{ fontSize: 14 }} /> Free WiFi
                                      </span>
                                      <span className="service-badge">
                                        <LocalParking style={{ fontSize: 14 }} /> Free Parking
                                      </span>
                                      <span className="service-badge">
                                        <AccessibilityNew style={{ fontSize: 14 }} /> Wheelchair Access
                                      </span>
                                      <span className="service-badge">
                                        <EmojiEmotions style={{ fontSize: 14 }} /> Customer Lounge
                                      </span>
                                    </div>
                                  </div>

                                  <div className="detail-section">
                                    <h5>Coordinates</h5>
                                    <p>
                                      <span>Lat: {center.latitude.toFixed(6)}</span>
                                      <br />
                                      <span>Lng: {center.longitude.toFixed(6)}</span>
                                    </p>
                                  </div>
                                </div>

                                <div className="action-buttons">
                                  <button
                                    className="map-action-btn"
                                    onClick={() => openMap(center)}
                                  >
                                    <LocationOn />
                                    Open in Google Maps
                                  </button>
                                  <button
                                    className={`select-btn ${isSelected ? "selected" : ""}`}
                                    onClick={() => setSelectedCenter(center)}
                                  >
                                    {isSelected ? (
                                      <>
                                        <CheckCircle />
                                        Selected
                                      </>
                                    ) : (
                                      <>
                                        <ThumbUp />
                                        Select This Center
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Col>

          {/* RIGHT COLUMN - ORDER SUMMARY */}
          <Col lg={5}>
            <div className="summary-card-enhanced">
              <h3>
                <LocalShipping style={{ fontSize: 24, marginRight: 8, color: "#019376" }} />
                Order Summary
              </h3>

              <div className="price-breakdown">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {selectedCenter && selectedCenter.deliveryFee > 0 && (
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>${selectedCenter.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <Divider style={{ margin: "16px 0" }} />
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* SELECTED LOCATION INFO */}
              {selectedCenter && (
                <div className="selected-location-info">
                  <div className="info-header">
                    <CheckCircle style={{ color: "#019376" }} />
                    <strong>Selected Pickup Location</strong>
                  </div>
                  <div className="center-name-selected">{selectedCenter.name}</div>
                  <div className="address-selected">{selectedCenter.address}</div>
                  <div className="eta-info">
                    <AccessTime style={{ fontSize: 16 }} />
                    <span>Estimated pickup time: {selectedCenter.etaMinutes || "N/A"} minutes</span>
                  </div>
                  <div className="eta-info">
                    <DirectionsCar style={{ fontSize: 16 }} />
                    <span>Delivery fee: ${selectedCenter.deliveryFee}</span>
                  </div>
                </div>
              )}

              {/* DELIVERY ESTIMATE */}
              <div className="delivery-estimate-modern">
                <div className="estimate-icon">
                  <DeliveryDining />
                </div>
                <div className="estimate-content">
                  <strong>Fast & Reliable Delivery</strong>
                  <small>Your order will be ready for pickup within the estimated time</small>
                </div>
              </div>

              {/* CONTINUE BUTTON */}
              <button
                className={`continue-btn-enhanced ${!selectedCenter ? "disabled" : ""}`}
                onClick={handleContinue}
                disabled={!selectedCenter}
              >
                {selectedCenter ? (
                  <>
                    Continue to Payment
                    <ChevronRight />
                  </>
                ) : (
                  <>
                    <Info />
                    Select a Center to Continue
                  </>
                )}
              </button>

              {/* SECURE FEATURES */}
              <div className="secure-features">
                <div className="feature">
                  <Security style={{ fontSize: 16 }} />
                  <span>Secure Checkout</span>
                </div>
                <div className="feature">
                  <Verified style={{ fontSize: 16 }} />
                  <span>Verified Centers</span>
                </div>
                <div className="feature">
                  <HomeRepairService style={{ fontSize: 16 }} />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* COUNTRY DROPDOWN DIALOG */}
      {/* <CountryDropdown
        open={openCountryDialog}
        onClose={() => setOpenCountryDialog(false)}
      /> */}
    </div>
  );
};

export default DeliveryLocationPage;