import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ReservationForm = (props) => {
  // for checking if all fields are inputted
  const [reservations, setReservations] = useState(""); // Track changes when fetching reservations data based on date
  const [dateinput, setDateInput] = useState("");
  const [timestartinput, setTimeStartInput] = useState("");
  const [timeendinput, setTimeEndInput] = useState("");
  const [nameinput, setNameInput] = useState("");
  const [phoneinput, setPhoneInput] = useState("");
  const [paxinput, setPaxInput] = useState("");
  const [tableinput, setTableInput] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); // State to track overall form validity
  const [isChecked, setIsChecked] = useState(false); // Check if Reservation Policy is ticked
  const [submit, setSubmit] = useState(false); // submit pop up
  const [confirm, setConfirm] = useState(false); // confirm pop up
  const restaurantId = useParams()._id; // Get restaurantId from url
  const popRef = useRef(null);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split("T")[0];

  // Go to the top of page when navigate to this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to handle input changes and check form validity
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update state based on input name
    switch (name) {
      case "dateinput":
        setDateInput(value);
        break;
      case "timestartinput":
        setTimeStartInput(value);
        break;
      case "timeendinput":
        setTimeEndInput(value);
        break;
      case "nameinput":
        setNameInput(value);
        break;
      case "phoneinput":
        setPhoneInput(value);
        break;
      case "paxinput":
        setPaxInput(value);
        break;
      case "tableinput":
        setTableInput(value);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    // Check if all required fields are filled
    const isValid =
      dateinput !== "" &&
      timestartinput !== "" &&
      timeendinput !== "" &&
      nameinput !== "" &&
      phoneinput !== "" &&
      paxinput !== "" &&
      tableinput !== "";

    console.log(
      "dateinput: ",
      dateinput,
      "timestartinput: ",
      timestartinput,
      "timeendinput",
      timeendinput,
      "nameinput",
      nameinput,
      "phoneinput",
      phoneinput,
      "paxinput",
      paxinput,
      "tableinput",
      tableinput,
      "restaurantid",
      restaurantId
    );

    // Update form validity state
    setIsFormValid(isValid);
  }, [
    dateinput,
    timestartinput,
    timeendinput,
    nameinput,
    phoneinput,
    paxinput,
    tableinput, // Every time fields are changed, constantly check if all the inputs are inputted
  ]);

  const getClosedDays = (openingHours) => {
    const daysMap = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    const openDays = openingHours.split(" ")[0].split("-");
    const openStart = daysMap[openDays[0]];
    const openEnd = daysMap[openDays[1]];
    const allDays = [0, 1, 2, 3, 4, 5, 6];
    return allDays.filter((day) => day < openStart || day > openEnd);
  };

  // Get reservations with same restaurantId and date every time dateinput is changed
  useEffect(() => {
    if (dateinput) {
      axios
        .get(
          `http://localhost:3001/api/reservation/reservations?date=${dateinput}&restaurantId=${restaurantId}`
        )
        .then((response) => {
          setReservations(response.data);
        })
        .catch((error) => {
          console.error("Error fetching reservations:", error);
        });
    }
    generateTableOptions();
  }, [dateinput]);

  const parseTime = (timeString) => {
    // Parse time with correct format
    if (timeString) {
      // Split the time string by colon and space
      const [time, period] = timeString.split(" ");

      // Split the time by colon to get hours and minutes
      const [hoursString, minutesString] = time.split(":");

      // Parse hours and minutes as numbers
      let hours = parseInt(hoursString, 10);
      let minutes = parseInt(minutesString, 10);

      // Adjust hours if it's PM
      if (period && period.toLowerCase() === "pm" && hours !== 12) {
        hours += 12; // Convert hours to 24-hour format if it's PM
      }

      return { hours, minutes };
    }
    return { hours: 0, minutes: 0 };
  };

  // Parse the opening hours string and extract opening and closing times
  const parseOpeningHours = (openingHours) => {
    // console.log(props.openinghours)
    if (props.tables !== null) {
      const timePattern = /\b\d{1,2}:\d{2}\s*(?:am|pm)?\b/gi;
      const times = openingHours.match(timePattern);
      // If times are found
      if (times && times.length >= 2) {
        const [openingTime, closingTime] = times;

        return { openingTime, closingTime };
      }
      return { openingTime: "", closingTime: "" };
    }
  };

  const { openingTime, closingTime } = parseOpeningHours(props.openinghours);

  const generateStartTimeOptions = (openingTime, closingTime) => {
    const options = [
      <option key="null" value="">
        Select a start time
      </option>,
    ];
    if (openingTime && closingTime) {
      const parsedOpeningTime = parseTime(openingTime);
      const parsedClosingTime = parseTime(closingTime);

      for (
        let hour = parsedOpeningTime.hours;
        hour <= parsedClosingTime.hours - 1.5;
        hour++
      ) {
        // Loop through each minute (0 and 30)
        for (let minute of [0, 30]) {
          const time = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;

          options.push(
            <option key={time} value={time}>
              {time}
            </option>
          );
        }
      }

      return options;
    }
    return [];
  };

  // Function to handle change in start time
  const handleStartTimeChange = (event) => {
    const selectedStartTime = event.target.value;
    setTimeStartInput(selectedStartTime);
    // Calculate end time by adding one hour to the start time
    const [startHour, startMinute] = selectedStartTime.split(":").map(Number);
    const endHour = startHour + 1;
    const endMinute = startMinute < 30 ? 0 : 30; // Round up to nearest half hour
    const formattedEndHour = endHour.toString().padStart(2, "0");
    const formattedEndMinute = endMinute.toString().padStart(2, "0");
    const calculatedEndTime = `${formattedEndHour}:${formattedEndMinute}`;
    setTimeEndInput(calculatedEndTime);
  };

  // Generate select options for pax no based on the max table pax of the restaurant
  const nopaxOptions = props.tables
    ? [
      <option key="null" value="">
        Select no of pax
      </option>,
      ...Array.from(
        { length: Math.max(...props.tables.map((table) => table.pax)) },
        (_, index) => (
          <option key={index + 1} value={index + 1}>
            {index + 1}
          </option>
        )
      ),
    ]
    : [];

  // Function to check if a table has enough capacity for the selected number of pax
  const checkTableCapacity = (table) => {
    return paxinput > table.pax;
  };

  // generate table options based on no of pax and availability
  const generateTableOptions = () => {
    if (!props.tables) return [];
    return [
      <option key="null" value="">
        Select a table
      </option>,
      ...props.tables.map((table, index) => (
        <option
          key={table._id}
          value={table._id}
          disabled={checkTableCapacity(table) || clashingTables.has(table._id)} // Disable table options that have less pax capacity or are unavailable due to clashing reservations
        >
          Table {table.name} - ({table.pax} pax capacity)
        </option>
      )),
    ];
  };
  const timeToMinutes = ({ hours, minutes }) => hours * 60 + minutes;

  // Function to check if a given time slot clashes with any existing reservation
  const isTimeSlotClashing = (reservation, timestartinput, timeendinput, dateinput) => {
    const reservationStartTime = timeToMinutes(
      parseTime(reservation.timestart)
    );
    const reservationEndTime = timeToMinutes(parseTime(reservation.timeend));
    const selectedStartTime = timeToMinutes(parseTime(timestartinput));
    const selectedEndTime = timeToMinutes(parseTime(timeendinput));

    if (
      selectedStartTime === reservationStartTime ||
      selectedStartTime === reservationStartTime + 30 ||
      selectedStartTime === reservationStartTime - 30
    ) {
      return true; // Clashing time slot found
    }

    return false; // No clashing time slot
  };

  // Function to disable tables with clashing reservations
  const disableClashingTables = (
    reservations,
    timestartinput,
    timeendinput
  ) => {
    const disabledTables = new Set(); // Using a Set to store unique table IDs

    reservations.forEach((reservation) => {
      if (isTimeSlotClashing(reservation, timestartinput, timeendinput)) {
        disabledTables.add(reservation.table_id); // Add the table_id to the disabled set
      }
    });
    // console.log("timestartinput", timestartinput);
    // console.log("disabled tables", disabledTables);
    return disabledTables;
  };

  // Create set that contains clashing tables
  const clashingTables =
    dateinput && reservations.length > 0 && timestartinput && timeendinput
      ? disableClashingTables(reservations, timestartinput, timeendinput)
      : new Set();

  // Generate table options whenever the number of pax input changes
  useEffect(() => {
    generateTableOptions();
  }, [paxinput]);

  // Use the generated table options in the select element
  const tableOptions = generateTableOptions();

  // ---- Checkings ----
  const isClosedOnDate = (dateinput, openinghours) => {
    const closedDays = getClosedDays(openinghours);
    const date = new Date(dateinput);
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    return closedDays.includes(dayOfWeek);
  };
  
  const handleCheckboxChange = () => {
    // Check if checkbox for reservation policy is checked
    setIsChecked(!isChecked);
  };

  const isValidName = (nameinput) => {
    const namePattern = /^[A-Za-z\s]+$/; // alphabets and spaces only
    return namePattern.test(nameinput); // test if nameinput follow the pattern
  };

  const isValidPhoneNumber = (phoneinput) => {
    const mobilePattern = /^01\d{8,9}$/; // Start with 01 and 10 or 11 in length only
    return mobilePattern.test(phoneinput); //test if phoneinput follow the pattern
  };


  const handleConfirm = () => {
    if (isClosedOnDate(dateinput, props.openinghours)) {
      alert("Restaurant is not open on that day. Please try another date.");
      return;
    }
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
        "Please check the box to indicate that you have read and understood the Reservation Policy."
      );
      return; // Stop further execution if isChecked is false
    }
    const token = localStorage.getItem("JomMakanUser"); // Get JWT from localStorage
    if (!token) {
      alert("User is not authenticated."); // Handle case where user is not authenticated
      return;
    }
    axios
      .post(
        "http://localhost:3001/api/reservation/reserve",
        {
          date: dateinput,
          timestart: timestartinput,
          timeend: timeendinput,
          name: nameinput,
          phone: phoneinput,
          pax: paxinput,
          table_id: tableinput,
          status: "U",
          restaurant_id: restaurantId,
        },
        {
          headers: {
            Authorization: token, // Include JWT in request headers
          },
        }
      )
      .then(() => {
        // alert("Reserved Successfully");
        setDateInput("");
        setTimeStartInput("");
        setTimeEndInput("");
        setNameInput("");
        setPhoneInput("");
        setPaxInput("");
        setTableInput("");
        setConfirm(true);
        //window.location.reload(); // reload window after reserve successfully
      })
      .catch((error) => {
        alert("Unable to reserve user");
        console.error(error);
      });
  };

  const handleClickOutside = (event) => {
    if (popRef.current && !popRef.current.contains(event.target)) {
      setConfirm(false);
      setSubmit(false);
      window.location.reload();
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
          Date:
          <br />
          <input
            id="Rinput"
            type="date"
            name="dateinput"
            min={tomorrowString}
            value={dateinput}
            onChange={(e) => {
              handleInputChange(e);
              // handleDateChange(e);
            }}
            required
          ></input>
        </div>

        <div>
          Time (24hr system):
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <select
              id="Rtimeinput"
              name="timestartinput"
              onChange={(event) => {
                handleInputChange(event);
                handleStartTimeChange(event);
              }}
              required
            >
              {generateStartTimeOptions(openingTime, closingTime)}
            </select>
            to
            <div
              id="Rtimeinput"
              name="timeendinput"
              style={{
                // minWidth: "100px",
                minHeight: "40px",
                paddingLeft: "14px",
              }}
              required
            >
              {timeendinput}
            </div>
          </div>
        </div>

        <div>
          Name:
          <br />
          <input
            id="Rinput"
            name="nameinput"
            onChange={handleInputChange}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Enter your name")}
            placeholder="Enter your name"
            required
          ></input>
        </div>

        <div>
          Phone No:
          <br />
          <input
            id="Rinput"
            type="tel"
            name="phoneinput"
            onChange={handleInputChange}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Enter your phone no")}
            placeholder="Enter your phone no"
            required
          ></input>
        </div>

        <div>
          No of pax:
          <br />
          <select
            id="Rinput"
            name="paxinput"
            onChange={(e) => {
              handleInputChange(e);
              // handlePaxChange(e);
            }}
            required
          >
            {nopaxOptions}
          </select>
        </div>

        <div>
          Table:
          <br />
          <select id="Rinput" name="tableinput" onChange={handleInputChange}>
            {tableOptions}
          </select>
        </div>

        <div id="Check">
          <label id="Rtext">
            <input
              id="checkbox"
              type="checkbox"
              name=""
              if=""
              checked={isChecked}
              onChange={(e) => {
                handleCheckboxChange(e);
              }}
              required
            />
            I have read and understood the Reservation Policy of this restaurant
          </label>
        </div>
        <button id="form-submitButton" onClick={() => setSubmit(!submit)}>
          Submit
        </button>
      </div>

      {submit && (
        <div className="popup-overlay">
          <div className="popup" ref={popRef}>
            <div>Confirm reservation?</div>
            <div>
              <button id="buttonPopupCancel" onClick={() => setSubmit(false)}>
                Cancel
              </button>
              <button
                onClick={() => {
                  setSubmit(false);
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

export default ReservationForm;
