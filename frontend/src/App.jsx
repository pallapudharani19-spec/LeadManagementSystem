import { useState, useEffect } from "react";

const API = "https://leadmanagementsystem-dv3s.onrender.com";

function App() {
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("Call");

  // FETCH LEADS
  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API}/leads`);

      if (!res.ok) throw new Error("Failed to fetch leads");

      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Fetch error:", err.message);
      setLeads([]);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ADD LEAD
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

      if (!res.ok) throw new Error("Failed to add lead");

      const data = await res.json();
      console.log("Added:", data);

      setName("");
      setPhone("");
      setSource("Call");

      fetchLeads();
    } catch (err) {
      console.log("Add error:", err.message);
    }
  };

  // DELETE LEAD
  const deleteLead = async (id) => {
    try {
      const res = await fetch(`${API}/leads/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      fetchLeads();
    } catch (err) {
      console.log("Delete error:", err.message);
    }
  };

  // UPDATE STATUS (FIXED PROPERLY)
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      fetchLeads();
    } catch (err) {
      console.log("Update error:", err.message);
    }
  };

  return (
    <div style={{ width: "400px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>Lead Management System</h2>

      {/* FORM */}
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

      {/* LEADS LIST */}
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