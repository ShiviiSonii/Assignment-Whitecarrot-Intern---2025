import React, { useState, useEffect } from "react";
import Modal from "./Modal.jsx"
import axios from "axios";
import Sun from "./assets/sun.png"
import Moon from "./assets/moon.png"
import Google from "./assets/google.png"
import "./App.css"

const App = () => {
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();


  const categorizeEvent = (event) => {
    const title = event.summary.toLowerCase();
    const description = event.description ? event.description.toLowerCase() : "";
    const location = event.location ? event.location.toLowerCase() : "";

    if (title.includes("meeting") || title.includes("sync")) {
      return "Work";
    }
    if (title.includes("birthday") || title.includes("anniversary")) {
      return "Personal";
    }
    if (title.includes("gym") || title.includes("doctor")) {
      return "Health";
    }
    if (description.includes("birthday") || description.includes("anniversary")) {
      return "Personal";
    }
    return "Uncategorized";
  };

  const addCategoriesToEvents = (events) => {
    return events.map((event) => ({
      ...event,
      category: categorizeEvent(event),
    }));
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/events", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/events", {
        withCredentials: true,
      });
      const categorizedEvents = addCategoriesToEvents(response.data);
      setEvents(categorizedEvents);
      setFilteredEvents(categorizedEvents);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterEvents(query, dateFilter, locationFilter, categoryFilter);
  };

  const handleDateFilter = (e) => {
    const selectedDate = e.target.value;
    setDateFilter(selectedDate);
    filterEvents(searchQuery, selectedDate, locationFilter, categoryFilter);
  };

  const handleLocationFilter = (e) => {
    const selectedLocation = e.target.value.toLowerCase();
    setLocationFilter(selectedLocation);
    filterEvents(searchQuery, dateFilter, selectedLocation, categoryFilter);
  };

  const handleCategoryFilter = (e) => {
    const selectedCategory = e.target.value;
    setCategoryFilter(selectedCategory);
    filterEvents(searchQuery, dateFilter, locationFilter, selectedCategory);
  };

  const handleReset = () => {
    setSearchQuery("");
    setDateFilter("");
    setLocationFilter("");
    setCategoryFilter("");
    setFilteredEvents(events); 
    setCurrentPage(1); 
  };

  const filterEvents = (query, date, location, category) => {
    const filtered = events.filter((event) => {
      const matchesSearch =
        event.summary.toLowerCase().includes(query) ||
        (event.description &&
          event.description.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query));

      const matchesDate = date
        ? new Date(event.start.dateTime || event.start.date)
            .toISOString()
            .split("T")[0] === date
        : true;

      const matchesLocation =
        location ? event.location && event.location.toLowerCase().includes(location) : true;

      const matchesCategory = category
        ? event.category.toLowerCase() === category.toLowerCase()
        : true;

      return matchesSearch && matchesDate && matchesLocation && matchesCategory;
    });

    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };


  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div
      style={{
        padding: "20px",
        background: isDarkMode
          ? "rgb(59, 59, 59)"
          : "white",
        color: isDarkMode ? "white" : "black",
        minHeight: "100vh",
        fontFamily: 'DM Sans'
      }}
      className="main-section"
    >
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center" , marginBottom:"10px"}}>
      <h1 style={{fontWeight:"600"}} className="main-heading">Google Calendar Events</h1>
      <div
        onClick={handleToggleDarkMode}
        style={{
          padding:"6px",
          color: "white",
          cursor: "pointer",
        }}
      >
        {isDarkMode ? <img src={Sun} alt="" height={20}/> : <img src={Moon} height={20}/>}
      </div>
      </div>

      {isModalOpen && <Modal event={selectedEvent} darkMode={isDarkMode} closeModal={closeModal} />}

      {!isLoggedIn ? (
        <div style={{ textAlign: "left", marginTop: "20px" }}>
          <span style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ff9800',
            backgroundColor: isDarkMode ? "#fff" : "#333",
            padding: '5px 10px',
            borderRadius: '3px',
            textTransform: 'uppercase',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginRight: '10px'
          }}>Note</span>
          <p style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: isDarkMode ? "black" : "white",
            lineHeight: '1.6',
            fontFamily: 'Arial, sans-serif',
            margin: '20px 0',
            textAlign: 'left',
            backgroundColor: isDarkMode ? "#fff" : "#333",
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            maxWidth: '100%',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            The app is currently in test mode, and to facilitate the testing process, I have added specific email addresses <span style={{fontWeight:"600", backgroundColor:"#ff9800", color:"black"}}>(naveen@whitecarrot.io, abhi@whitecarrot.io)</span> for this assignment. In order to access and use the app, please make sure to log in using these provided email IDs. This will help ensure that the app is functioning as expected during the testing phase.<br/> Thank you for your understanding and cooperation.
          </p>
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: isDarkMode ? "white": "black",
              color: isDarkMode ? "black": "white",
              border: "none",
              padding: "14px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"10px"}}>
              <img src={Google} alt="" height={20} width={20} />
              <span>Login with Google</span>
            </div>
          </button>
        </div>
      ) : (
        <div>
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", flexWrap:"wrap" }}>
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                  padding: "10px",
                  width: "300px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  background: isDarkMode
                  ? "white"
                  : "white",
                }}
                className="custom-input"
              />
              <input
                type="date"
                value={dateFilter}
                onChange={handleDateFilter}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
              <input
                type="text"
                placeholder="Filter by location"
                value={locationFilter}
                onChange={handleLocationFilter}
                className="custom-input"
                style={{
                  padding: "10px",
                  width: "200px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
              <select
                value={categoryFilter}
                onChange={handleCategoryFilter}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value="">All Categories</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Uncategorized">Uncategorized</option>
              </select>
              <button
                onClick={handleReset}
                style={{
                  backgroundColor: isDarkMode ? "#000000" : "#fff",  
                  color: isDarkMode ? "#fff" : "black", 
                  padding: "10px 20px",
                  borderColor: isDarkMode ? "white" : "rgb(204, 204, 204)",  
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  marginLeft: "10px",
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {currentEvents.length > 0 ? (
            <div className="table-section">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  minWidth:"max-content"
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        backgroundColor: isDarkMode ? "#333" : "#f1f1f1",
                        color: isDarkMode ? "white" : "black",
                      }}
                    >
                      Event Title
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        backgroundColor: isDarkMode ? "#333" : "#f1f1f1",
                        color: isDarkMode ? "white" : "black",
                      }}
                    >
                      Event Date
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        backgroundColor: isDarkMode ? "#333" : "#f1f1f1",
                        color: isDarkMode ? "white" : "black",
                      }}
                    >
                      Location
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        backgroundColor: isDarkMode ? "#333" : "#f1f1f1",
                        color: isDarkMode ? "white" : "black",
                      }}
                    >
                      Category
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        backgroundColor: isDarkMode ? "#333" : "#f1f1f1",
                        color: isDarkMode ? "white" : "black",
                      }}
                    >
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEvents.map((event) => (
                    <tr
                      key={event.id}
                      onClick={() => handleRowClick(event)}
                      style={{
                        backgroundColor: isDarkMode ? "#444" : "#fff",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <td
                        style={{
                          padding: "14px",
                          color: isDarkMode ? "white" : "black",
                        }}
                      >
                        {event.summary}
                      </td>
                      <td
                        style={{
                          padding: "14px",
                          color: isDarkMode ? "white" : "black",
                        }}
                      >
                        {new Date(event.start.dateTime || event.start.date).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "14px",
                          color: isDarkMode ? "white" : "black",
                        }}
                      >
                        {event.location || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "14px",
                          color: isDarkMode ? "white" : "black",
                        }}
                      >
                        <span 
                        style={{
                          border:"1px solid black",
                          padding:"5px 10px",
                          borderRadius:"5px",
                          textTransform:"uppercase",
                          fontSize:"12px",
                          fontWeight:"800",
                          backgroundColor: event.category === "Work"
                          ? "#e3f2fd" 
                          : event.category === "Personal"
                          ? "#ffebee" 
                          : event.category === "Health"
                          ? "#c7b7e4" 
                          : "#fdc895", 
                          color: event.category === "Work"
                          ? "#577e9c" 
                          : event.category === "Personal"
                          ? "#e17676" 
                          : event.category === "Health"
                          ? "#815cc7" 
                          : "#d97514", 
                          borderColor: event.category === "Work"
                          ? "#577e9c" 
                          : event.category === "Personal"
                          ? "#e17676" 
                          : event.category === "Health"
                          ? "#815cc7" 
                          : "#d97514", 
                          }}
                          
                          >{event.category}
                          </span>
                      </td>
                      <td
                        style={{
                          padding: "14px",
                          color: isDarkMode ? "white" : "black",
                        }}
                      >
                        {event.description || "No description added"} 
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    backgroundColor: isDarkMode ? "#000000" : "#fff",  
                    color: isDarkMode ? "#fff" : "black",  
                    padding: "10px 20px",
                    borderColor: isDarkMode ? "white" : "rgb(204, 204, 204)",  
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginLeft: "10px",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>
                <span style={{ padding: "10px 20px" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    backgroundColor: isDarkMode ? "#000000" : "#fff", 
                    color: isDarkMode ? "#fff" : "black",  
                    padding: "10px 20px",
                    borderColor: isDarkMode ? "white" : "rgb(204, 204, 204)",  
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginLeft: "10px",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: "center" }}>No events found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
