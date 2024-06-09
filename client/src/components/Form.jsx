import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//<Form date={null}/>
//For the registration form
const RegistrationForm = (props) => {
  const [registrations, setRegistrations] = useState(""); // Track changes when fetching registration data based on date
  const [nameinput, setNameInput] = useState("");
  const [phoneinput, setPhoneInput] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); // State to track overall form validity
  const [isChecked, setIsChecked] = useState(false); // Check if Registration Policy is ticked
  const [paxinput, setPaxInput] = useState("");
  const [submit, setSubmit] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const popRef = useRef(null);
  const workshopId = useParams()._id; // Get workshopId from url
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update state based on input name
    switch (name) {
      case "nameinput":
        setNameInput(value); // Pass checkFormValidity as callback
        break;
      case "phoneinput":
        setPhoneInput(value); // Pass checkFormValidity as callback
        break;
      case "paxinput":
        if (props.available < value) {
          alert(
            `We do not have enough slots for ${value}. Please reduce the number of pax or choose another workshop.\nCurrent available slots: ${props.available}`
          );
          setPaxInput(""); // Clear the pax input field
        } else if (value <= 0) {
          alert(`You have entered ${value}. Please enter valid number > 0.`);
          setPaxInput(""); // Clear the pax input field
        } else {
          setPaxInput(value);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Check if all required fields are filled
    const isValid = nameinput !== "" && phoneinput !== "" && paxinput !== 0;

    console.log(
      "nameinput",
      nameinput,
      "phoneinput",
      phoneinput,
      "paxinput",
      paxinput,
      "workshopid",
      workshopId
    );

    // Update form validity state
    setIsFormValid(isValid);
  }, [nameinput, phoneinput, paxinput]);

  const getDateTime = (props) => {
    if (!props || !props.date) return "";
    const dateOnly = props.date.split("T")[0];
    const date = new Date(dateOnly);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year} @ ${props.time}`;
  };

  // Get registration with same workshopId
  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/registration/registrations?workshopId=${workshopId}`
      )
      .then((response) => {
        setRegistrations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
      });
  });

  const handleCheckboxChange = () => {
    // Check if checkbox for registration policy is checked
    setIsChecked(!isChecked);
  };

  const isValidName = (nameinput) => {
    const namePattern = /^[A-Za-z\s]+$/; // alphabets and spaces only
    return namePattern.test(nameinput); // test if nameinput follows the pattern
  };

  const isValidPhoneNumber = (phoneinput) => {
    const mobilePattern = /^01\d{8,9}$/; // Start with 01 and 10 or 11 in length only
    return mobilePattern.test(phoneinput); //test if phoneinput follow the pattern
  };

  const handleConfirm = () => {
    if (!isFormValid) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!isValidName(nameinput)) {
      alert("Are you sure this is your name, Mr " + nameinput + " ?");
      return;
    }
    if (!isValidPhoneNumber(phoneinput)) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (!isChecked) {
      alert(
        "Please check the box to indicate that you have read and understood the Registration Policy."
      );
      setConfirm(false);
      setSubmit(false);
      return; // Stop further execution if isChecked is false
    }

    const token = localStorage.getItem("JomMakanUser"); // Get JWT from localStorage
    //const { token } = useAuth();
    if (!token) {
      alert("User is not authenticated."); // Handle case where user is not authenticated
      return;
    }
    axios
      .post(
        "http://localhost:3001/api/registration/new_registration",
        {
          name: nameinput,
          phone: phoneinput,
          pax: paxinput,
          status: "U",
          workshop_id: workshopId,
        },
        {
          headers: {
            Authorization: token, // Include JWT in request headers
          },
        }
      )
      .then(() => {
        // alert("Registered Successfully");
        setNameInput("");
        setPhoneInput("");
        setPaxInput("");
        setConfirm(true);
        setSubmit(false);
        //window.location.reload(); // reload window after reserve successfully
      })
      .catch((error) => {
        alert("Unable to register user");
      });
  };

  const handleClickOutside = (event) => {
    if (popRef.current && !popRef.current.contains(event.target)) {
      setConfirm(false);
      setSubmit(false);
      navigate(-1); // Navigate up one level in the URL hierarchy
      //window.location.reload(); // reload window after reserve successfully
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div id="Rform">
      <div id="Rinputs">
        <div>
          Date and Time:
          <br />
          <div id="Rinput">{getDateTime(props)}</div>
        </div>
        <div>
          Name:
          <br />
          <input
            id="Rinput"
            required
            name="nameinput"
            onChange={(e) => {
              handleInputChange(e);
              // handleDateChange(e);
            }}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Enter your name")}
            placeholder="Enter your name"
          ></input>
        </div>
        <div>
          Phone No:
          <br />
          <input
            id="Rinput"
            type="tel"
            required
            name="phoneinput"
            onChange={(e) => {
              handleInputChange(e);
              // handleDateChange(e);
            }}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Enter your phone no")}
            placeholder="Enter your phone no"
          ></input>
        </div>
        <div>
          No of pax:
          <br />
          <input
            id="Rinput"
            type="number"
            required
            name="paxinput"
            value={paxinput}
            onChange={(e) => {
              handleInputChange(e);
              // handleDateChange(e);
            }}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Enter number of pax")}
            placeholder="Enter the number of pax"
          ></input>
        </div>
        <div id="Check">
          <label id="Rtext">
            <input
              id="checkbox"
              type="checkbox"
              name=""
              if=""
              required
              checked={isChecked}
              onChange={(e) => {
                handleCheckboxChange(e);
              }}
            />
            I have read and understood the Registration Policy of this
            restaurant
          </label>
        </div>
        <button id="form-submitButton" onClick={() => setSubmit(!submit)}>
          Submit
        </button>
      </div>

      {submit && (
        <div className="popup-overlay">
          <div className="popup" ref={popRef}>
            <div>Confirm registration?</div>
            <div>
              <button id="buttonPopupCancel" onClick={() => setSubmit(false)}>
                Cancel
              </button>
              <button
                onClick={() => {
                  handleConfirm();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {confirm && (
        <div className="popup-overlay">
          <div className="popup" ref={popRef}>
            <i className="bi bi-calendar2-check-fill"></i>
            <div>Confirmed</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
