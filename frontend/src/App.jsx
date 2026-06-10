import { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("Call");
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("http://localhost:5000/leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addLead = async () => {
    if (name.trim() === "" || phone.trim() === "") {
      alert("Please enter Name and Phone Number");
      return;
    }

    try {
      await fetch("http://localhost:5000/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          source,
          status: "Interested",
        }),
      });

      setName("");
      setPhone("");
      setSource("Call");

      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteLead = async (id) => {
    try {
      await fetch(`http://localhost:5000/leads/${id}`, {
        method: "DELETE",
      });

      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      fetchLeads();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        width: "450px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Lead Management System
      </h2>

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        type="text"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <option>Call</option>
        <option>WhatsApp</option>
        <option>Field</option>
      </select>

      <button
        onClick={addLead}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        Add Lead
      </button>

      <h3>Lead List</h3>

      {leads.length === 0 ? (
        <p>No leads found.</p>
      ) : (
        leads.map((lead) => (
          <div
            key={lead.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <p>
              <strong>Name:</strong> {lead.name}
            </p>

            <p>
              <strong>Phone:</strong> {lead.phone}
            </p>

            <p>
              <strong>Source:</strong> {lead.source}
            </p>

            <p>
              <strong>Status:</strong>
            </p>

            <select
              value={lead.status}
              onChange={(e) =>
                updateStatus(lead.id, e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
              }}
            >
              <option>Interested</option>
              <option>Not Interested</option>
              <option>Converted</option>
            </select>

            <br />
            <br />

            <button
              onClick={() => deleteLead(lead.id)}
              style={{
                width: "100%",
                padding: "8px",
              }}
            >
              Delete Lead
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;