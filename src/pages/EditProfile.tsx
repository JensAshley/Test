import React, { useState } from 'react';
import TextEntry from '../components/TextEntry';
import { auth } from '../app/firebaseSetup';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { addUser } from '../app/reducer';
import { mapStateToProps } from '../app/store';
import { Row, Col } from "react-bootstrap";
//import DatePicker from "react-datepicker";
import DatePicker from "../components/DatePicker";
import {createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, child, get } from "firebase/database";
import UserIcon from '../components/UserIcon';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import NavBar from "../components/NavBar";
import backgroundPic from './assets/backgroundPic.jpg';
type SetLoginType = React.Dispatch<React.SetStateAction<boolean>>;

const dbRef = ref(getDatabase());

const EditProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (event: any) => {

    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      navigate("/");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage);
    });
  }
  // Handle login when user clicks the login button


  return (
    <div style={{ display: "flex", flexDirection: "row", }}>
      {/* Vertical Navbar */}
      <NavBar />
  
      <h2>Edit Profile</h2>
      <Form>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text" 
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text" 
              />
            </Form.Group>
          </Col>
         <Col>
            <Button variant="primary" onClick={onSubmit}>Submit</Button>
         </Col>
        </Row>
      </Form>
    </div>
    
  )
}

export default connect(mapStateToProps)(EditProfile);