import React, { useState } from "react";

const DonateForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    const donationData = { name, email, description };

      try {
      const response = await fetch("http://localhost:5000/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationData),
      });

           if (response.ok) {
        alert("✅ Thank you! Your donation request has been submitted.");
        setName("");
        setEmail("");
        setDescription("");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message ||
            "❌ There was an error submitting your donation request. Please try again."
        );
      }
    }

     catch (error) {
      console.error("Error:", error);
      setError(
        "❌ There was an error submitting your donation request. Please try again."
      );
    }
  };
