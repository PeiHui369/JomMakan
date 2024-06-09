import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import "./Restaurant.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BsStar } from "react-icons/bs";
import axios from "axios";

const renderRatingStars = (rating) => {
  const filledStars = Math.floor(rating);
  const decimalPart = rating - filledStars;
  const hasHalfStar = decimalPart >= 0.25 && decimalPart < 0.75;
  const hasPartialStar = decimalPart >= 0.75;

  return (
    <div className="star-container">
      {[...Array(filledStars)].map((_, index) => (
        <i class="bi bi-star-fill"></i>
      ))}
      {hasHalfStar && <i class="bi bi-star-half"></i>}
      {hasPartialStar && <i class="bi bi-star-fill"></i>}
      {[
        ...Array(5 - filledStars - (hasHalfStar || hasPartialStar ? 1 : 0)),
      ].map((_, index) => (
        <BsStar key={filledStars + index} class="bi bi-star" />
      ))}
    </div>
  );
};

const Restaurant = () => {
  const navigate = useNavigate();
  const popRef = useRef(null);
  const [deleted, setDelete] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDetailsPopups, setShowDetailsPopups] = useState(0);
  const [hasLikes, setHasLikes] = useState([]);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState(null);
  const [selectedShareOption, setSelectedShareOption] = useState(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [isDropdownIndex, setIsDropdownIndex] = useState(null);
  const [likedReviews, setLikedReviews] = useState(new Set()); // Use a Set to track liked reviews

  // Go to the top of page when navigate to this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { _id } = useParams();
  let userId = "User123";

  // get userid from local storage
  const storedUser = JSON.parse(localStorage.getItem("JomMakanUser"));
  if (storedUser) {
    userId = storedUser.user._id;
  }

  const handleWhatsApp = (review) => {
    const message = `Hey there! I just discovered this amazing restaurant with fantastic reviews. People are craving about their delicious food and great service. Let's plan a date to check it out together! 😊🍽️ \n\nRestaurant Name: ${restaurant.name} \nRatings: ${review.rating} stars \nReview: ${review.reviewDescription}`;

    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;

    window.location.href = whatsappUrl;
    setIsDropdownIndex(null);
  };

  const handleEmail = (review) => {
    const subject = "Check out this restaurant!";
    const body = `Hey there! I just discovered this amazing restaurant with fantastic reviews. People are craving about their delicious food and great service. Let's plan a date to check it out together! 😊🍽️\n
      Restaurant Name: ${restaurant.name} \n 
      Ratings: ${review.rating} stars \n 
      Review: ${review.reviewDescription} \n `;
    console.log(review.rating);
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setIsDropdownIndex(null);
  };

  const [restaurant, setRestaurant] = useState({});
  const [reviews, setReviews] = useState([]);
  const [restaurantReviews, setRestaurantReviews] = useState([]); // Initialize as empty array
  const [ratingPercentages, setRatingPercentages] = useState([0, 0, 0, 0, 0]);
  const [averageRating, setAverageRating] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null); // State to hold the selected review for editing

  const handleDropdownToggle = (index) => {
    setIsDropdownIndex(isDropdownIndex === index ? null : index);
  };

  const handleEditDropdownToggle = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleLike = async (reviewId, index) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("JomMakanUser"));
      const token = storedUser.token;
      // const userId = localStorage.getItem("JomMakanUser").user._id;
      //  console.log(storedUser);
      //  console.log(token);
      if (!token) {
        alert("User is not authenticated.");
        return;
      }

      // Check if the review is already liked by the user
      // const isLiked = hasLikes[index];

      // Toggle the like status
      // const updatedHasLikes = [...hasLikes];
      // updatedHasLikes[index] = !isLiked;

      // Update the state with the modified hasLikes data
      // setHasLikes(updatedHasLikes);

      // Send the request to the server to like/unlike the review
      console.log(reviewId);
      console.log(token);
      console.log(userId);
      const response = await axios.post(
        `http://localhost:3001/api/review/${reviewId}/likeReview`,
        {
          _id: reviewId,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(reviewId);
      console.log("index", index);

      console.log(response.data);
      // // Update likedBy field in the review database based on the user's action
      // const updatedReviews = [...restaurantReviews];
      // const likedBy = updatedReviews[index].likedBy || [];
      // // const userId = storedUser.user._id;
      // // console.log(userId);
      // if (isLiked) {
      //   // If already liked, remove the user ID from likedBy
      //   const updatedLikedBy = likedBy.filter((id) => id !== userId);
      //   updatedReviews[index].likedBy = updatedLikedBy;
      // } else {
      //   // If not liked, add the user ID to likedBy
      //   const updatedLikedBy = [...likedBy, userId];
      //   updatedReviews[index].likedBy = updatedLikedBy;
      // }
      // console.log(isLiked);
      // // Update the state with the modified reviews data
      // setRestaurantReviews(updatedReviews);

      setLikedReviews((prevLikedReviews) => {
        const updatedLikedReviews = new Set(prevLikedReviews);
        if (updatedLikedReviews.has(reviewId)) {
          updatedLikedReviews.delete(reviewId);
        } else {
          updatedLikedReviews.add(reviewId);
        }
        return updatedLikedReviews;
      });
    } catch (error) {
      console.error("Error liking review:", error);
      // Handle error
    }
  };

  // let handler = (e) => {
  //   if (popRef.current && !popRef.current.contains(e.target)) {
  //     setDelete(false);
  //   }
  // };

  // document.addEventListener("mousedown", handler);

  // return () => {
  //   document.removeEventListener("mousedown", handler);
  // };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        // Get the token from localStorage or from wherever it's stored
        const token = localStorage.getItem("JomMakanUser");
        if (!token) {
          alert("User is not authenticated.");
          return;
        }

        // Set the request headers with the token
        // const config = token ? { headers: { Authorization: token } } : {};

        const { data } = await axios.get(
          `http://localhost:3001/api/restaurant/${_id}`,
          { headers: { Authorization: token } }
        );

        // Log the retrieved data for debugging
        console.log(data.restaurant);
        console.log(data.isSaved);

        // Update state with the retrieved restaurant data
        setRestaurant(data.restaurant);

        // If isSaved is defined in the response, update the state
        if (data.isSaved !== undefined) {
          setIsSaved(data.isSaved);
        }
      } catch (error) {
        console.error("Error fetching restaurant or isSaved status:", error);
      }
    };

    // Call the fetchRestaurantData function when the component mounts or when _id changes
    fetchRestaurantData();
  }, [_id]); // Dependency array

  useEffect(() => {
    // const fetchReviewData = async () => {
    //   try {
    //     const response = await axios.get(
    //       `http://localhost:3001/api/review/${_id}/shareReview`
    //     );
    //     setReview(response.data);
    //   } catch (error) {
    //     console.error("Error fetching review data:", error);
    //   }
    // };

    // fetchReviewData();
    fetchReviews();
  }, [_id, likedReviews]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/review/${_id}/reviews`
      );
      const reviews = response.data;

      setRestaurantReviews(reviews);

      // Calculate average rating
      const average = calculateAverageRating(reviews);
      setAverageRating(average);

      // Update the average rating in the database
      // updateAverageRatingInDatabase(average);

      calculateRatingPercentages(reviews);
      setReviews(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // const updateAverageRatingInDatabase = async (averageRating) => {
  //   try {
  //     const token = localStorage.getItem("JomMakanUser");
  //     const response = await axios.put(
  //       `http://localhost:3001/api/restaurant/${_id}/updateAverageRating`,
  //       {
  //         averageRating: averageRating,
  //       },
  //       {
  //         headers: {
  //           Authorization: token,
  //         },
  //       }
  //     );
  //     console.log("Average rating updated successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error updating average rating:", error);
  //   }
  // };

  const isLikedFn = (review) => {
    return review.likedBy.includes(userId);
  };

  const handleSaveToggle = async () => {
    const token = localStorage.getItem("JomMakanUser");
    if (!token) {
      alert("User is not authenticated."); // Handle case where user is not authenticated
      return;
    }

    if (!restaurant) {
      console.log("Restaurant data is not loaded.");
      return;
    }

    try {
      if (isSaved) {
        // If the restaurant is already saved, perform unsave action
        const savedRestaurant = await axios.get(
          `http://localhost:3001/api/restaurant/favrestaurants/${restaurant._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const favRestaurantId = savedRestaurant.data._id; // Extract favRestaurantId from the response

        await axios.delete(
          `http://localhost:3001/api/restaurant/favrestaurants/${favRestaurantId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("Restaurant unsaved successfully");
        setIsSaved(false); // Update the state to reflect the unsaved state
      } else {
        // If the restaurant is not saved, perform save action
        await axios.post(
          `http://localhost:3001/api/restaurant/${restaurant._id}/addFavRestaurant`,
          {
            ...restaurant,
            restaurant_id: restaurant._id,
            status: "S",
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("Restaurant saved successfully");
        setIsSaved(true); // Update the state to reflect the saved state
      }
    } catch (error) {
      console.log("Unable to perform save/unsave action:", error.message);
    }
  };

  const handleDelete = async (reviewId) => {
    console.log(reviewId);
    const token = localStorage.getItem("JomMakanUser");
    try {
      // Send DELETE request to delete the review
      await axios.delete(
        `http://localhost:3001/api/review/${reviewId}/deleteReview`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      // Handle error or display error message to user
    }
  };

  const calculateRatingPercentages = (reviews) => {
    const total = reviews.length;
    const totalRatings = reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const averageRating = totalRatings / total;
    const percentages = [0, 0, 0, 0, 0].map((_, index) => {
      const rating = index + 1;
      const count = reviews.filter(
        (review) => Math.floor(review.rating) === rating
      ).length;
      return (count / total) * 100;
    });
    setRatingPercentages(percentages);
  };

  const calculateAverageRating = (reviews) => {
    const total = reviews.length;
    const totalRatings = reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    return total > 0 ? totalRatings / total : 0;
  };
  const getTimeDifferenceString = (timePosted) => {
    const currentTime = new Date();
    const postedTime = new Date(timePosted);
    const timeDifference = Math.floor((currentTime - postedTime) / 1000); // Time difference in seconds

    if (timeDifference < 60) {
      return "now"; // If less than a minute ago
    } else if (timeDifference < 3600) {
      const minutes = Math.floor(timeDifference / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`; // If less than an hour ago
    } else if (timeDifference < 86400) {
      const hours = Math.floor(timeDifference / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`; // If less than a day ago
    } else {
      const days = Math.floor(timeDifference / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`; // If more than a day ago
    }
  };

  const handleEdit = async (reviewId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/review/${reviewId}`
      );
      const reviewData = response.data;

      navigate(
        `/restaurant/${_id}/${reviewId}/addReview?edit=true&restaurantName=${restaurant.name}`,
        { state: { reviewData } }
      );
    } catch (error) {
      console.error("Error fetching review data:", error);
      // Handle error if needed
    }
  };
  useEffect(() => {
    if (location.state && location.state.reviewData) {
      const { rating, reviewDescription /* other fields */ } =
        location.state.reviewData;
      setRatingInput(rating);
      setDescriptionInput(reviewDescription);
      // Set other state variables for other form fields
    }
  }, [location.state]);

  return (
    <div>
      <Navbar />
      <div className="container">
        <br />
        <div className="d-flex justify-content-between align-items-center">
          {/* <Link to={`/home`} className="back-btn"> */}
          <div
          className="back-btn"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left-circle"></i> Back
          </div>
          <div className="ml-auto">
            <small className="back-btn" onClick={handleSaveToggle}>
              <i
                className={`bi ${
                  isSaved ? "bi-heart-fill" : "bi-heart"
                } custom-icon`}
              ></i>
              {isSaved ? "Unsave this restaurant" : "Save this restaurant"}
            </small>
          </div>
        </div>
        <br />
        <img
          src={restaurant.image}
          alt=""
          style={{ width: "100%", height: "500px", objectFit: "cover" }}
        />
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="custom-h1">{restaurant.name}</h1>
          <div>
            <Link to={`/restaurant/${_id}/reserve`}>
              <button id="reserve-btn">
                {/* <i className="bi bi-calendar-heart custom-icon"></i>Make */}
                Make Reservation
              </button>
            </Link>
          </div>
        </div>

        <p className="card-text">{restaurant.description}</p>
        <p className="card-text">
          <i className="bi-geo-alt-fill custom-icon"></i>
          {restaurant.phone}
        </p>
        <p className="card-text">
          <i className="bi bi-telephone-fill custom-icon"></i>
          {restaurant.address}
        </p>
        <p className="card-text">
          <i className="bi bi-clock-fill custom-icon"></i>
          {restaurant.openinghours}
        </p>
        <p className="card-text">
          <i className="bi bi-egg-fried custom-icon"></i>
          {restaurant.cuisine}
        </p>
        <br />
        <h5 className="card-text">
          <strong>Photos</strong>
        </h5>
        <div
          id="carouselExampleControls"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {restaurant.foodImage &&
              restaurant.foodImage.map((photo, index) => (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  key={index}
                >
                  <img
                    src={photo}
                    className="d-block w-100"
                    alt={`Slide ${index + 1}`}
                    style={{ height: "500px", objectFit: "contain" }}
                  />
                </div>
              ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <br />
        <div className="d-flex justify-content-between align-items-center">
          <h5 id="review-title ">
            <strong>Reviews</strong>
          </h5>
          <div className="ml-auto">
            <Link
              to={`/restaurant/${_id}/addReview?restaurantName=${restaurant.name}`}
            >
              <button type="button" className="button-add-reviews">
                <i className="bi-plus"></i>Add a review
              </button>
            </Link>
          </div>
        </div>
        <div
          className="box-flex fd-column info-reviews-rating-section"
          data-testid="info-reviews-rating"
        >
          <div className="info-left">
            <div id="star-container">
              <div className="rating-value">{averageRating.toFixed(1)}</div>

              <div className="rating-star-colour">
                {renderRatingStars(averageRating)}
              </div>
            </div>
            <br />
            <div className="f-title-xlarge-secondary-font-size fw-title-xlarge-secondary-font-weight">
              All ratings ({restaurantReviews.length})
            </div>
          </div>{" "}
          <div className="rating-bar-container">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div className="rating-bar" key={index}>
                <div className="star-indicator">
                  {rating} <i className="bi bi-star-fill"></i>
                </div>
                <div className="rectangle-box">
                  <div
                    className="fillable-box"
                    style={{
                      width: `${Math.round(ratingPercentages[5 - index - 1])}%`,
                      height: "100%",
                    }}
                  />
                </div>
                <div className="percentage">
                  {ratingPercentages[5 - index - 1].toFixed(0)}%
                </div>
              </div>
            ))}{" "}
          </div>
        </div>

        {restaurantReviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="name-and-view-more d-flex justify-content-between align-items-center">
              <p>
                <strong>{review.userName}</strong>
                {review.user_id ===
                  JSON.parse(localStorage.getItem("JomMakanUser")).user._id && (
                  <div className="dropdown-share">
                    <button
                      className="btn btn-secondary dropdown-toggle dropdown-view-more"
                      type="button"
                      id="dropdownViewMoreButton"
                      onClick={() => handleEditDropdownToggle(index)}
                    >
                      <i className="bi-three-dots"></i>
                    </button>

                    <ul
                      className={`dropdown-menu dropdown-view-more ${
                        openDropdownIndex === index ? "show" : ""
                      }`}
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(review._id)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>{" "}
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDelete(review._id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </p>
            </div>
            {/* {deleted && (
              <div className="popup-overlay">
                <div className="popup" ref={popRef}>
                  <div>Confirm delete?</div>
                  <div>
                    <button onClick={() => handleDelete(review._id)}>
                      Confirm
                    </button>

                    <button
                      id="buttonPopupCancel"
                      onClick={() => setDelete(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )} */}
            {/* 
            <span
              className="review-options"
              onClick={() => togglePopup(index)}
            ></span>
            {showDetailsPopups[index] && (
              <div className="review-options-popup">
                <button onClick={handleEdit} >
                  <i className="bi bi-pencil"></i> Edit
                </button>
                <button>
                  <i className="bi bi-trash"></i> Delete
                </button>
              </div>
            )} */}

            <div className="d-flex justify-content-start">
              <div>{renderRatingStars(review.rating)}</div>&nbsp;&nbsp;
              <p className="time-post">
                {getTimeDifferenceString(review.timePosted)}
              </p>
            </div>

            <p>{review.reviewDescription}</p>
            {review.media.url && (
              <img src={review.media.url} className="review-photo" />
            )}

            <div className="photo-buttons">
              <button
                className="btn-like"
                onClick={() => handleLike(review._id, index)} // Pass index parameter here
                // style={{ color: hasLikes[index] ? "blue" : "black" }}
                style={{ color: isLikedFn(review) ? "blue" : "black" }}
              >
                <i
                  className={
                    isLikedFn(review)
                      ? "bi bi-hand-thumbs-up-fill"
                      : "bi bi-hand-thumbs-up"
                  }
                ></i>{" "}
                Helpful ({review.likedBy.length})
              </button>

              <div className="dropdown-share">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  onClick={() => handleDropdownToggle(index)}
                >
                  <i className="bi bi-share"></i> Share
                </button>
                <ul
                  className={`dropdown-menu ${
                    isDropdownIndex === index ? "show" : ""
                  }`}
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleWhatsApp(review)}
                    >
                      Share On WhatsApp
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleEmail(review)}
                    >
                      Share On Email
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurant;
