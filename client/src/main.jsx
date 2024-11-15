import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Home from "./Home.jsx";
import LogIn from "./LogIn.jsx";
import SignUp from "./SignUp.jsx";
import Profile from "./Profile.jsx";
import ResetPassword from "./ResetPassword.jsx";
import ResetPassword2 from "./ResetPassword2.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import Workshop from "./WorkshopPage.jsx";
import FavWorkshop from "./FavWorkshop.jsx";
import WRegistration from "./Registration.jsx";
import FavRestaurant from "./FavRestaurant.jsx";
import Restaurant from "./Restaurant.jsx";
import AddReview from "./AddReview.jsx";
import Scehdule from "./MyRegistration.jsx";
import Reserve from "./Reserve.jsx";
import Reservations from "./Reservations.jsx";
import NotFoundPage from "./404.jsx";
import { AuthContextProvider } from "./context/AuthContext";
import { RatingProvider } from "./RatingContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <RatingProvider>
        <AuthContextProvider>
          <Routes>
            <Route exact path="/" element={<App />} />
            <Route exact path="/login" element={<LogIn />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route
              exact
              path="/reset-password"
              element={<ResetPassword />}
            ></Route>
            <Route
              exact
              path="/forgot-password"
              element={<ForgotPassword />}
            ></Route>
            <Route
              exact
              path="/reset-password/:id/:token"
              element={<ResetPassword2 />}
            ></Route>
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/restaurant/:_id" element={<Restaurant />} />

            <Route exact path="/workshop" element={<Workshop />} />
            <Route exact path="/fav-workshop" element={<FavWorkshop />} />
            <Route exact path="/workshop/:_id" element={<WRegistration />} />
            <Route exact path="/fav-restaurant" element={<FavRestaurant />} />
            <Route exact path="/restaurant/:_id" element={<Restaurant />} />
            <Route
              exact
              path="/restaurant/:restaurantId/addFavRestaurant"
              element={<Restaurant />}
            />
            <Route
              exact
              path="/workshop/:workshopId/addFavWorkshop"
              element={<Workshop />}
            />
            <Route
              exact
              path="/restaurant/:_id/addReview"
              element={<AddReview />}
            />
            <Route
              exact
              path="/restaurant/:_id/:reviewId/addReview"
              element={<AddReview />}
            />
            <Route exact path="/schedule" element={<Scehdule />} />
            <Route
              exact
              path="/restaurant/:_id/reserve"
              element={<Reserve />}
            />
            <Route exact path="/reservations" element={<Reservations />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthContextProvider>
      </RatingProvider>
    </Router>
  </React.StrictMode>
);
