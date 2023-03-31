import React, { useState } from "react";
import "./Form.css";
import { db } from "./firebaseConfig";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import countriesData from "./data/countries.json";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";


const countries = Object.values(countriesData).map((country) => country.name);

function Form() {
  const [name, setName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");

  const openSnackbar = (type) => {
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if the invoice number already exists in Firestore
    try {
      const invoiceRef = doc(collection(db, "customers"), invoiceNumber);
      const invoiceSnapshot = await getDoc(invoiceRef);
  
      if (invoiceSnapshot.exists()) {
        console.error("Invoice number already exists");
        openSnackbar("error");
        return;
      }
    } catch (error) {
      console.error("Error checking invoice number existence:", error);
      openSnackbar("error");
      return;
    }
  
    // Create an object with the form data
    const customerData = {
      name,
      email,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      state,
      country,
      phone,
      invoiceNumber,
    };
  
    // Add the new customer data to Firestore with the invoice number as the document ID
    try {
      const customerRef = doc(collection(db, "customers"), invoiceNumber);
      await setDoc(customerRef, customerData);
      console.log("Document written with ID:", invoiceNumber);
      openSnackbar("success");
    } catch (error) {
      console.error("Error adding document:", error);
      openSnackbar("error");
    }
  
    // Reset the form fields
    setName("");
    setEmail("");
    setAddressLine1("");
    setAddressLine2("");
    setAddressLine3("");
    setCity("");
    setState("");
    setCountry("");
    setPhone("");
    setInvoiceNumber("");
  };
  
  

  

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h1>Fill in the details</h1>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="addressLine1">Address Line 1</label>
        <input
          type="text"
          id="addressLine1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          required
        />

        <label htmlFor="addressLine2">Address Line 2</label>
        <input
          type="text"
          id="addressLine2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
        />

        <label htmlFor="addressLine3">Address Line 3</label>
        <input
          type="text"
          id="addressLine3"
          value={addressLine3}
          onChange={(e) => setAddressLine3(e.target.value)}
        />

        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <label htmlFor="state">State</label>
        <input
          type="text"
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />

        <div className="input-field">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a country
            </option>
            {countries.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="invoiceNumber">Invoice Number</label>
        <input
          type="text"
          id="invoiceNumber"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarType}
          sx={{ width: "100%" }}
        >
          {snackbarType === "success"
            ? "Form submitted successfully!"
            : "An error occurred while submitting the form."}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Form;
