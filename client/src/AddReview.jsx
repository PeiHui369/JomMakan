import React, { useState, useEffect, useRef } from "react";
import "./AddReview.css";
import Navbar from "./components/Navbar";
import { Link, useParams } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MyDropzone from "./components/MyDropzone";
import axios from "axios";
import Popup from "reactjs-popup";

const AddReview = () => {
  const { _id, reviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = new URLSearchParams(location.search).get("edit") || "false";

  const [reviewData, setReviewData] = useState(false);
  const params = new URLSearchParams(location.search);
  const restaurantName = params.get("restaurantName");
  const popRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");

  const [showPopup, setShowPopup] = useState(false);
  const token = localStorage.getItem("JomMakanUser");

  const handleUploadFile = async (selectedFile) => {
    setUploadStatus("loading");
    setSelectedFile(selectedFile);
    setTimeout(() => {
      setUploadStatus("success");
    }, 3000);

  };

  const resetUploadStatus = () => {
    setUploadStatus("idle");
  };

  const handleRating = (rate) => {
    setratingInput(rate);
  };
 
  const handleClickOutside = (event) => {
    if (popRef.current && !popRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };
  
  const [ratingInput, setratingInput] = useState(params.get("rating") || "");
  const [descriptionInput, setDescriptionInput] = useState(
    params.get("description") || ""
  );
  const [mediaInput, setMediaInput] = useState(params.get("media") || "");
  const [isChecked, setIsChecked] = useState(
    params.get("isChecked") === "true" || false
  );

useEffect(() => {
  const fetchReview = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/review/${reviewId}`
      );
      setReviewData(response.data);
    } catch (error) {
      console.error("Error fetching review:", error);
    }
  };

  if (editMode) {
    fetchReview();
  }
}, [reviewId, editMode]);
  
  const submitReview = async () => {
    if (!ratingInput || !descriptionInput || !selectedFile || !isChecked) {
      alert("Please complete all fields before submitting the review.");
      return;
    }

    if (editMode == "true") {
      const formData = new FormData();
      formData.append("restaurant_id", _id);
      formData.append("rating", ratingInput);
      formData.append("timePosted", new Date());
      formData.append("reviewDescription", descriptionInput);
      formData.append("image", selectedFile);
      formData.append("agreeToTerms", isChecked);

      try {
        const response = await axios.put(
          `http://localhost:3001/api/review/${reviewId}/editReview`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        

        console.log("Review updated successfully:", response.data);
        navigate(`/restaurant/${_id}`);
      } catch (error) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Error request data:", error.request);
        } else {
          console.error("General error message:", error.message);
        }
      }
    } else {
      const formData = new FormData();
      formData.append("restaurant_id", _id);
      formData.append("rating", ratingInput);
      formData.append("timePosted", new Date());
      formData.append("reviewDescription", descriptionInput);
      formData.append("image", selectedFile);
      formData.append("agreeToTerms", isChecked);

      try {
        const response = await axios.post(
          `http://localhost:3001/api/review/${_id}/addReview`,
          formData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("Review submitted successfully:", response.data);
        navigate(`/restaurant/${_id}`);
      } catch (error) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Error request data:", error.request);
        } else {
          console.error("General error message:", error.message);
        }
      }
    }
  };

  const handleDescriptionChange = (event) => {
    setDescriptionInput(event.target.value);
  };
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 

  return (
    <div>
      <div>
        <Navbar />
        <div id="main-container">
          <div className="back">
            <div
              className="back-btn"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left-circle"></i> Back
            </div>
          </div>
          <div id="form">
            <h2>
              <b>Rate a restaurant</b>
            </h2>
            <p id="desc">
              It only takes a minute! And your review will help other restaurant
              seekers.
            </p>
            <div id="inputs">
              <div id="restaurantName">
                Restaurant Name: <span className="input">{restaurantName}</span>
              </div>
              <br></br>
              <div id="ratings">
                Overall Ratings:
                <br />
                <Rating onClick={handleRating} value={ratingInput} />
              </div>
              <br></br>
              <div>
                Review:
                <br />
                <textarea
                  className="textArea"
                  rows="4"
                  cols="50"
                  value={descriptionInput}
                  onChange={handleDescriptionChange}
                />
              </div>
              <br></br>
              <div>
                Media Upload:
                <MyDropzone
                  handleUploadFile={handleUploadFile}
                  uploadStatus={uploadStatus}
                  resetUploadStatus={resetUploadStatus}
                  selectedFile={selectedFile}
                />
              </div>

              <br></br>
              <div id="checkbox">
                <input
                  type="checkbox"
                  value={isChecked}
                  checked={isChecked}
                  onChange={(e) => {
                    handleCheckboxChange(e);
                  }}
                  required
                />
                &nbsp;I agree to the JomMakan Terms of Use and that this review
                is an honest and accurate account of my experience at the
                restaurant.
                <br />
              </div>
            </div>
            <Popup
              contentStyle={{ width: "450px", borderRadius: "20px" }}
              trigger={<button id="form-submitButton">Submit Review</button>}
              modal
              nested
            >
              {(close) => (
                <div className="popup-overlay">
                  <div className="popup log-out-popup" ref={popRef}>
                    <div id="log-out-popup-title">Confirm</div>
                    <div className="popup-buttons">
                      <button id="cancel-button" onClick={close}>
                        Cancel
                      </button>
                      <button
                        id="yes-button"
                        onClick={() => {
                          submitReview();
                          close();
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Popup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
