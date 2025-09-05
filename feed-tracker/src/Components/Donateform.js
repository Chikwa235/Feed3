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