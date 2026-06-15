import { useState, useEffect } from "react";

const API = "https://leadmanagementsystem-dv3s.onrender.com";

function App() {
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("Call");

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API}/leads`);
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Fetch error:", err);
      setLeads([]);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Add lead
  const addLead = async () => {
    if (!name || !phone) {
      alert("Enter name and phone");
      return;
    }

    try {
      const res = await fetch(`${API}/leads`, {
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

      const data = await res.json();
      console.log("Added:", data);

      setName("");
      setPhone("");
      setSource("Call");

      fetchLeads(); // refresh list
    } catch (err) {
      console.log("Add error:", err);
    }
  };

  // Delete lead
  const deleteLead = async (id) => {
    try {
      await fetch(`${API}/leads/${id}`, {
        method: "DELETE",
      });
      fetchLeads();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      fetchLeads();
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  return (
    <div style={{ width: "400px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>Lead Management System</h2>

      {/* Form */}
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", margin: "5px 0", padding: "8px" }}
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: "100%", margin: "5px 0", padding: "8px" }}
      />

      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        style={{ width: "100%", margin: "5px 0", padding: "8px" }}
      >
        <option>Call</option>
        <option>WhatsApp</option>
        <option>Field</option>
      </select>

      <button onClick={addLead} style={{ width: "100%", padding: "10px" }}>
        Add Lead
      </button>

      <hr />

      {/* Leads */}
      {leads.length === 0 ? (
        <p>No leads found</p>
      ) : (
        leads.map((lead) => (
          <div
            key={lead.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            <p><b>Name:</b> {lead.name}</p>
            <p><b>Phone:</b> {lead.phone}</p>

            <select
              value={lead.status}
              onChange={(e) => updateStatus(lead.id, e.target.value)}
              style={{ width: "100%", padding: "5px" }}
            >
              <option>Interested</option>
              <option>Not Interested</option>
              <option>Converted</option>
            </select>

            <button
              onClick={() => deleteLead(lead.id)}
              style={{ marginTop: "5px", width: "100%" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;