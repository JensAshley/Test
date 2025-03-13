import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import SearchBar from "../components/SearchBar";
import FormButton from "../components/FormButton";
import { Link, useNavigate } from "react-router-dom";
import { getFirestore, query } from "firebase/firestore";
import { FaUser } from 'react-icons/fa';
import {
  collection,
  query as firestoreQuery,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import app from "../app/firebaseSetup";
import NavBar from "../components/NavBar";
import SearchResult from "../components/SearchResult";
import IncompleteFormCard from "../components/IncompleteFormCard";
import Modal from "react-bootstrap/esm/Modal";
import { Button, Tabs, Tab, Card } from "react-bootstrap";
import StickyNote from "../components/StickyNote"; // Import StickyNote component

const db = getFirestore(app);
const usersCollection = collection(db, "patients");
const remindersCollection = collection(db, "reminders");
const incompleteCollection = collection(db, "incomplete");

const Home: React.FC = () => {
  const admin = useSelector((state: RootState) => state.user);


  // TODO: replace dummy values with actual patient profiles from Firestore
  const [patients, setPatients] = useState<any[]>([
    { id: "1", patient_info: { first_name: "John", last_name: "Doe" } },
    { id: "2", patient_info: { first_name: "Jane", last_name: "Smith" } },
    { id: "3", patient_info: { first_name: "Michael", last_name: "Johnson" } },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [reminderText, setReminderText] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [incompleteForms, setIncompleteForms] = useState<any[]>([]);
  const [searchedPatients, setSearchedPatients] = useState<any[]>([]);
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [patientSearchQuery, setPatientSearchQuery] = useState<string>("");

  const navigate = useNavigate();

  const handleShowModal = (patientId: string) => {
    setSelectedPatientId(patientId);
    setPatientSearchQuery("");
    setSearchedPatients([]);
    setSelectedPatientName("");
    setShowModal(true);
  };

  const handlePatientModal = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowPatientModal(true);
  };



  
  const handlePatientSearch = async (query: string) => {
    setPatientSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchedPatients([]);
      return;
    }
  
    try {
      // Create a query that looks for patients where name_lower contains the search string
      const q = firestoreQuery(
        usersCollection,
        where('patient_info.name_lower', '>=', query.toLowerCase()),
        where('patient_info.name_lower', '<=', query.toLowerCase() + '\uf8ff')
      );
  
      const querySnapshot = await getDocs(q);
      const patients = querySnapshot.docs.map(doc => ({
        id: doc.id,
        patient_info: doc.data().patient_info
      }));
  
      // Optionally, you could add a second query if you want to specifically target first and last name with `name_lower` as well, but it seems like `name_lower` should be sufficient.
      
      setSearchedPatients(patients);
    } catch (error) {
      console.error("Error searching patients:", error);
      setSearchedPatients([]);
    }
  };
  
  

  const handleCloseModal = () => {
    setShowModal(false);
    setReminderText("");
  };

  const handleClosePatientModal = () => {
    setShowPatientModal(false);
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatientId(patient.id);
    setSelectedPatientName(`${patient.patient_info.first_name} ${patient.patient_info.last_name}`);
    setSearchedPatients([]); // Clear search results
    setPatientSearchQuery(""); // Clear search input
  };

  const handleAddReminder = async () => {
    if (!reminderText.trim() || !selectedPatientId) return;

    try {
      await addDoc(remindersCollection, {
        patientId: selectedPatientId,
        text: reminderText,
      });
      setReminderText("");
      alert("Reminder added successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error adding reminder: ", error);
    }
  };

  const loadIncompleteForms = async () => {
    const querySnapshot = await getDocs(incompleteCollection);
    const forms = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setIncompleteForms(forms);
  };

  useEffect(() => {
    loadIncompleteForms();
  }, []);

  const handleIncompleteFormClick = (formId: string) => {
    navigate(`/newpatient?formId=${formId}`);
  };

  const handleDeleteForm = async (formId: string) => {
    await deleteDoc(doc(db, "incomplete", formId));
    setIncompleteForms((prevForms) =>
      prevForms.filter((form) => form.id !== formId)
    );
  };

  const [hasSearched, setHasSearched] = useState(false); // track if search was performed

  const handleSearch = async (searchType: string, queryValue: string) => {
    if (!queryValue.trim()) return;

    setHasSearched(true); // mark that a search has been done

    const searchLower = queryValue.toLowerCase();
    const endValue = searchLower + "\uf8ff";

    const q = firestoreQuery(
      usersCollection,
      where("patient_info.name_lower", ">=", searchLower),
      where("patient_info.name_lower", "<=", endValue)
    );

    try {
      const querySnapshot = await getDocs(q);
      let users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSearchResults(users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };


  return (
    <div className="main">
      <NavBar />

      <div className="content" style={{ padding: "20px", flexGrow: 1 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchBar onSearch={handleSearch} />
            <div style={{ marginLeft: "20px" }}>
              <Link
                to="/newpatient"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FormButton onFormSubmit={() => { }} />
              </Link>
              <Link to="/editprofile"><Button>
                Edit Profile
              </Button>
              </Link>
            </div>
          </div>

          {hasSearched && searchResults.length === 0 ? (
            <p>No results found</p>
          ) : (
            searchResults.length > 0 && <SearchResult results={searchResults} />
          )}


          <p style={{ fontSize: "25px" }}>Patient Portal</p>

          {/* Incomplete Forms Section */}
          <h4>Incomplete Forms</h4>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {incompleteForms.length > 0 ? (
              incompleteForms.map((form) => (
                <IncompleteFormCard
                  key={form.id}
                  form={form}
                  onClick={() => handleIncompleteFormClick(form.id)}
                  onDelete={() => handleDeleteForm(form.id)}
                />
              ))
            ) : (
              <p>No current incomplete forms</p>
            )}
          </div>

          {/* Sticky Note */}
          <StickyNote />

          {/* Tabs Inside a Box */}
          <Card
            className="mb-3"
            style={{ borderRadius: "8px", border: "1px solid #ddd" }}
          >
            <Card.Body>
              <Tabs
                defaultActiveKey="frequentlyAccessedPatients"
                id="patient-tabs"
                className="custom-tabs"
              >
                <Tab
                  eventKey="frequentlyAccessedPatients"
                  title="Frequently Accessed Patients"
                >
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {patients.map((patient) => (
                      <Card
                        key={patient.id}
                        style={{ width: "18rem", margin: "10px" }}
                      >
                        <Card.Body>
                          <Card.Title>
                            {patient.patient_info.first_name}{" "}
                            {patient.patient_info.last_name}
                          </Card.Title>
                          <Button onClick={() => handlePatientModal(patient.id)}>
                            View Profile
                          </Button>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Tab>

                <Tab eventKey="patientReminders" title="Patient Reminders">
                  <h4>Patient Reminders</h4>
                  <Button onClick={() => handleShowModal("1")}>
                    Add Reminder
                  </Button>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </div>
        
        {/* Patient Modal */}
        <Modal show={showPatientModal} onHide={handleClosePatientModal}>
          <Modal.Header closeButton>
            <Modal.Title>Patient Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaUser size={18} />
            <strong>John Doe</strong>
            </div>
            <p></p>
            <p><strong>Gender:</strong></p>
            <p><strong>Date of Birth:</strong></p>
            <p><strong>Address:</strong></p>
            <p><strong>Fall Risk Score:</strong></p>
            <p><strong>Medications:</strong></p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePatientModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>


        {/* Reminder Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>Send Reminder</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="mb-3 position-relative">
      <label htmlFor="patientSearch" className="form-label">Search Patient</label>
      <input
        type="text"
        id="patientSearch"
        className="form-control"
        value={patientSearchQuery}
        onChange={(e) => handlePatientSearch(e.target.value)}
        placeholder="Search for a patient..."
      />
      
      
      {/* Search Results Dropdown */}
      {patientSearchQuery.length >= 2 && (
        <div 
          className="position-absolute w-100 mt-1 border rounded bg-white shadow-sm" 
          style={{ 
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {searchedPatients.length > 0 ? (
            searchedPatients.map((patient) => (
              <div
                key={patient.id}
                className="p-2 hover:bg-gray-100 cursor-pointer border-bottom"
                onClick={() => handlePatientSelect(patient)}
                style={{ cursor: 'pointer' }}
              >
                {patient.patient_info.first_name} {patient.patient_info.last_name}
              </div>
            ))
          ) : (
            <div className="p-2 text-muted">No patients found</div>
          )}
        </div>
      )}

      {/* Selected Patient Display */}
      {selectedPatientName && (
        <div className="mt-2 p-2 bg-light rounded">
          Selected Patient: {selectedPatientName}
        </div>
      )}
    </div>
  

    {/* Reminder Input */}
    <div className="mt-3">
      <label htmlFor="reminderText" className="form-label">Reminder Message</label>
      <input
        type="text"
        id="reminderText"
        className="form-control"
        value={reminderText}
        onChange={(e) => setReminderText(e.target.value)}
        placeholder="Enter reminder message"
      />
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Cancel
    </Button>
    <Button 
      variant="primary" 
      onClick={handleAddReminder}
      disabled={!selectedPatientId || !reminderText.trim()}
    >
      Send
    </Button>
  </Modal.Footer>
</Modal>
      </div>
    </div>
  );
};

export default Home;
