import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";
import image from "./assets/image 3.png";
import { useNavigate,Link } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import WorkshopCard from "./components/WorkshopCard";

const FavWorkshop = () => {
  const [workshops, setWorkshops] = useState([]);
  const [favWorkshops, setUserFavWorkshops] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("JomMakanUser"));
  // const token = user?.token; // Get token from local storage
  //const userId = user?.id; // Get user ID from local storage

  useEffect(() => {
    //get userid from local storage
    const token = localStorage.getItem("JomMakanUser");
    if (!token) {
      alert("User is not authenticated.");
      return;
    }
    
    axios
      .get("http://localhost:3001/api/workshop/favworkshops", {
        headers: {
          Authorization: token,
        },
      })
      .then(({ data }) => {
        setUserFavWorkshops(data);
      })
      .catch((error) => {
        console.error("Error fetching registrations:", error);
      });
  }, []); // Empty dependency array to fetch data only once when component mounts

  // Filter workshops by user ID and search query
  const filteredWorkshops = favWorkshops.filter((workshop) => {
    const { workshopName, workshopDescription } = workshop;
    const query = searchQuery.toLowerCase();
    return (
        workshopName.toLowerCase().includes(query) ||
        workshopDescription.toLowerCase().includes(query)
      
    );
  });

  return (
    <div>
      <Navbar />
      <img src={image} alt="" style={{ width: "100%" }} />
      <div className="container">
        <br />
          <Link to={`/workshop`} className="back-btn">
            <i className="bi bi-arrow-left-circle"></i> Back
          </Link>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="customized-h1 workshop-header">Favourite Workshops</h1>
          <div className="ml-auto">
            <SearchBar
              place="workshops, events, ..."
              onSearch={(query) => setSearchQuery(query)}
            />
          </div>
        </div>
        <br />
        <div className="workshop-grid">
          {filteredWorkshops.map((workshop) => (
            <WorkshopCard key={workshop._id} workshop={workshop} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavWorkshop;
