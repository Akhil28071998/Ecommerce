import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  // State to hold the GST and Discount values
  const [gst, setGst] = useState(18);
  const [discount, setDiscount] = useState(10);

  // State to track which field is being edited
  const [editing, setEditing] = useState(null);

  // State for temporary input value
  const [tempValue, setTempValue] = useState("");

  const handleEdit = (field) => {
    setEditing(field);
    setTempValue(field === "gst" ? gst : discount);
  };

  const handleSave = (field) => {
    if (field === "gst") setGst(Number(tempValue));
    if (field === "discount") setDiscount(Number(tempValue));
    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
  };

  return (
    <div className="admin-content">
      <div className="content-wrapper">
        <h2>Settings</h2>
        <p>Here you can configure GST and discount settings for your store.</p>

        <table>
          <thead>
            <tr>
              <th>Setting</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GST (%)</td>
              <td>
                {editing === "gst" ? (
                  <input
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                ) : (
                  gst
                )}
              </td>
              <td>
                {editing === "gst" ? (
                  <>
                    <button onClick={() => handleSave("gst")}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit("gst")}>Edit</button>
                )}
              </td>
            </tr>
            <tr>
              <td>Discount (%)</td>
              <td>
                {editing === "discount" ? (
                  <input
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                ) : (
                  discount
                )}
              </td>
              <td>
                {editing === "discount" ? (
                  <>
                    <button onClick={() => handleSave("discount")}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit("discount")}>Edit</button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;
