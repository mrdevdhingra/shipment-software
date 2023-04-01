import React, { useState, useEffect, useCallback } from "react";
import { db } from "./firebaseConfig";
import "./DataTable.css";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { collection, query, onSnapshot } from "firebase/firestore";
import TrackingNumberInput from "./TrackingNumberInput";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([10, 25, 50]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailRow, setDetailRow] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [detailData, setDetailData] = useState(data);
  const [trackingInfo, setTrackingInfo] = useState([
    { carrier: "ANPOST", trackingNumber: "", id: 0 },
  ]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "customers")),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(data);
      }
    );

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedInvoice) {
      console.log(selectedInvoice);
      const customerRef = doc(collection(db, "customers"), selectedInvoice);

      const unsubscribe = onSnapshot(customerRef, (docSnapshot) => {
        console.log("Snapshot updated");
        const data = docSnapshot.data();
        const updatedTrackingInfo = data.trackingInfo || [];

        // Update your UI with the updated tracking info
        // For example, if you're using React state:
        setDetailData((prevData) => ({
          ...prevData,
          trackingInfo: updatedTrackingInfo,
        }));
      });

      // Clean up the listener when the component is unmounted or the selectedInvoice changes
      return () => unsubscribe();
    }
  }, [selectedInvoice]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRowsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset current page to the first page
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleRefresh = async () => {
    if (selectedInvoice) {
      console.log(selectedInvoice);
      const customerRef = doc(collection(db, "customers"), selectedInvoice);
      console.log(customerRef); // Add this line
      const docSnapshot = await getDoc(customerRef);
      console.log(docSnapshot); // Add this line
      const data = docSnapshot.data();
      const updatedTrackingInfo = data.trackingInfo || [];

      setDetailData((prevData) => ({
        ...prevData,
        trackingInfo: updatedTrackingInfo,
      }));
    }
  };

  const handlePageClick = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenClick = (rowData) => {
    setDetailData(rowData);
    setShowDetail(true);
  };

  const handleEditClick = (rowData) => {
    setSelectedRow(rowData);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const sortedData = React.useMemo(() => {
    let sorted = [...data];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [data, sortConfig]);

  const DetailView = ({ data, onClose, trackingInfo }) => {
    useEffect(() => {
      setDetailData(data);
    }, [data]);
    return (
      <div className={`detail-view ${detailData ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>User Details</h2>
          <button onClick={onClose} style={{ alignSelf: "flex-start" }}>
            Close
          </button>
        </div>
        {data && (
          <>
            <p>
              <strong>Invoice:</strong>{" "}
              <span id="selectedInvoiceNumber">{detailData.invoiceNumber}</span>
            </p>
            <p>
              <strong>Name:</strong> {detailData.name}
            </p>
            <p>
              <strong>Email:</strong> {detailData.email}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {`${detailData.addressLine1}, ${
                detailData.addressLine2 ? detailData.addressLine2 + "," : ""
              } ${
                detailData.addressLine3 ? detailData.addressLine3 + "," : ""
              } ${detailData.city}, ${detailData.state}, ${detailData.country}`}
            </p>
            <p>
              <strong>Phone:</strong> {detailData.phone}
            </p>
            {detailData.trackingInfo && (
              <div>
                <h3>Tracking Info:</h3>
                {detailData.trackingInfo.map((info, index) => (
                  <p key={index}>
                    <strong>{info.carrier}:</strong> {info.trackingNumber}
                  </p>
                ))}
              </div>
            )}

            <form onSubmit={handleTrackingFormSubmit}>
              {trackingInfo.map((info, index) => (
                <div key={info.id} className="tracking-info">
                  <select
                    className="carrier"
                    value={info.carrier}
                    onChange={(e) =>
                      updateTrackingInfo(index, "carrier", e.target.value)
                    }
                  >
                    <option value="ANPOST">ANPOST</option>
                    <option value="UPS">UPS</option>
                  </select>
                  <TrackingNumberInput
                    value={info.trackingNumber}
                    onChange={(e) =>
                      updateTrackingInfo(
                        index,
                        "trackingNumber",
                        e.target.value
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeTrackingInfo(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button type="button" onClick={addTrackingInfo}>
                Add
              </button>
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </>
        )}
        <button onClick={handleRefresh}>Refresh</button>
      </div>
    );
  };

  const removeTrackingInfo = (index) => {
    setTrackingInfo((prevTrackingInfo) =>
      prevTrackingInfo.filter((_, i) => i !== index)
    );
  };

  const handleSave = async () => {
    // Update the data state with the edited row data
    setData((prevData) =>
      prevData.map((item) => (item.id === selectedRow.id ? selectedRow : item))
    );

    // Close the modal
    handleModalClose();

    // Update the data in Firestore
    try {
      const customerRef = doc(db, "customers", selectedRow.id);
      await updateDoc(customerRef, {
        name: selectedRow.name,
        email: selectedRow.email,
        addressLine1: selectedRow.addressLine1,
        addressLine2: selectedRow.addressLine2,
        addressLine3: selectedRow.addressLine3,
        city: selectedRow.city,
        state: selectedRow.state,
        country: selectedRow.country,
        phone: selectedRow.phone,
        invoiceNumber: selectedRow.invoiceNumber,
      });
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const addTrackingInfo = () => {
    setTrackingInfo((prevTrackingInfo) => [
      ...prevTrackingInfo,
      { carrier: "ANPOST", trackingNumber: "", id: prevTrackingInfo.length },
    ]);
  };

  const updateTrackingInfo = (index, field, value) => {
    setTrackingInfo((prevTrackingInfo) => {
      prevTrackingInfo[index][field] = value;
      return [...prevTrackingInfo];
    });
  };

  const handleTrackingFormSubmit = async (e) => {
    e.preventDefault();

    // Get the selected invoice number
    const selectedInvoice = document.getElementById(
      "selectedInvoiceNumber"
    ).innerText;

    // Update the Firestore document with the tracking info
    try {
      const customerRef = doc(collection(db, "customers"), selectedInvoice);

      // Read the existing tracking info
      const customerDoc = await getDoc(customerRef);
      const existingTrackingInfo = customerDoc.data().trackingInfo || [];

      // Merge existing and new tracking info
      const mergedTrackingInfo = [...existingTrackingInfo, ...trackingInfo];

      // Update the document with the merged tracking info
      await updateDoc(customerRef, { trackingInfo: mergedTrackingInfo });
      console.log("Tracking info updated");

      // Reset the form trackingInfo state
      setTrackingInfo([{ carrier: "ANPOST", trackingNumber: "", id: 0 }]);
    } catch (error) {
      console.error("Error updating tracking info:", error);
    }
  };

  const filteredData = sortedData.filter((item) =>
    item.name
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="container">
      <div className="search-bar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort("invoiceNumber")}>Invoice</th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("email")}>Email</th>
            <th onClick={() => handleSort("address")}>Address</th>
            <th onClick={() => handleSort("phone")}>Phone</th>
            <th onClick={() => handleSort("status")}>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              <td>{item.invoiceNumber}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>
                {item.addressLine1},{" "}
                {item.addressLine2 ? `${item.addressLine2}, ` : ""}
                {item.addressLine3 ? `${item.addressLine3}, ` : ""}
                {item.city}, {item.state}, {item.country}
              </td>

              <td>{item.phone}</td>
              <td>{item.status}</td>
              <td>
                <button onClick={() => handleEditClick(item)}>Edit</button>
                <button onClick={() => handleOpenClick(item)}>Open</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-options">
        <div className="rows-per-page">
          Rows per page:
          <select value={itemsPerPage} onChange={handleRowsPerPageChange}>
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="pagination">
          <button
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                disabled={currentPage === page}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit User</h2>
            <form>
              <label>Invoice:</label>
              <input
                type="text"
                value={selectedRow?.invoiceNumber}
                onChange={(e) =>
                  setSelectedRow((prev) => ({
                    ...prev,
                    invoiceNumber: e.target.value,
                  }))
                }
              />

              <label>Name:</label>
              <input
                type="text"
                value={selectedRow?.name}
                onChange={(e) =>
                  setSelectedRow((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <label>Email:</label>
              <input
                type="text"
                value={selectedRow?.email}
                onChange={(e) =>
                  setSelectedRow((prev) => ({ ...prev, email: e.target.value }))
                }
              />

              <label>Address Line 1:</label>
              <input
                type="text"
                value={selectedRow?.addressLine1}
                onChange={(e) =>
                  setSelectedRow((prev) => ({
                    ...prev,
                    addressLine1: e.target.value,
                  }))
                }
              />

              <label>Address Line 2:</label>
              <input
                type="text"
                value={selectedRow?.addressLine2}
                onChange={(e) =>
                  setSelectedRow((prev) => ({
                    ...prev,
                    addressLine2: e.target.value,
                  }))
                }
              />

              <label>Address Line 3:</label>
              <input
                type="text"
                value={selectedRow?.addressLine3}
                onChange={(e) =>
                  setSelectedRow((prev) => ({
                    ...prev,
                    addressLine3: e.target.value,
                  }))
                }
              />

              <label>City:</label>
              <input
                type="text"
                value={selectedRow?.city}
                onChange={(e) =>
                  setSelectedRow((prev) => ({ ...prev, city: e.target.value }))
                }
              />

              <label>State:</label>
              <input
                type="text"
                value={selectedRow?.state}
                onChange={(e) =>
                  setSelectedRow((prev) => ({ ...prev, state: e.target.value }))
                }
              />

              <label>Country:</label>
              <input
                type="text"
                value={selectedRow?.country}
                onChange={(e) =>
                  setSelectedRow((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
              />

              <label>Phone:</label>
              <input
                type="tel"
                value={selectedRow?.phone}
                onChange={(e) =>
                  setSelectedRow((prev) => ({ ...prev, phone: e.target.value }))
                }
              />

              <label>Invoice Number:</label>
              <input
                type="text"
                value={selectedRow?.invoiceNumber}
                onChange={(e) =>
                  setSelectedRow((prev) => ({
                    ...prev,
                    invoiceNumber: e.target.value,
                  }))
                }
              />
            </form>
            <div className="button-container">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleModalClose}>Close</button>
            </div>
          </div>
        </div>
      )}
      {showDetail && (
        <DetailView
          data={detailData}
          onClose={() => setShowDetail(false)}
          trackingInfo={trackingInfo}
          key={detailData?.id}
        />
      )}
    </div>
  );
};

export default DataTable;
