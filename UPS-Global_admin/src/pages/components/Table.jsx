import React, { useEffect, useState } from "react";
import { FaEllipsisV, FaTimes } from "react-icons/fa";
import { getDocs, collection } from "firebase/firestore";
import { dataBase } from "../../config/firebase";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function TableComponent() {
  const [product, setproduct] = useState([]);
  const docRef = collection(dataBase, "products");

  const [selectedTrackingNumber, setSelectedTrackingNumber] = useState(null);
  const navigate = useNavigate();

  const handleEllipsisClick = (trackingNumber) => {
    setSelectedTrackingNumber(trackingNumber);
  };

  const handleModalClose = () => {
    setSelectedTrackingNumber(null);
  };

  const handleUpdateStatus = (trackingNumber) => {
    // Navigate to the "update status" page with the trackingNumber
    navigate(`/update/${trackingNumber}`);
  };

  //useeffect for getting the data from firebase
  useEffect(() => {
    const getProducts = async () => {
      try {
        const docSnap = await getDocs(docRef);
        const productData = docSnap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setproduct(productData);
      } catch (error) {
        console.log("Error getting documents: ", error);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="overflow-auto">
      <table className="w-full table-auto bg-white border border-gray-100 relative">
        <thead>
          <tr>
            <th className=" text-start pl-2 pr-2">S/N</th>
            <th className=" text-start">Tracking Number</th>
            <th className=" text-start">Shipping Date</th>
            <th className=" text-start">Delievery Date</th>
            <th className=" text-start">Error Date</th>
            <th className=" text-start">Status</th>
          </tr>
        </thead>
        <tbody>
          {product.map((item, index) => (
            <tr key={item.id || index} className="w-[80%] p-52">
              <td className="text-start pt-2 pb-2 pl-2">{index + 1}</td>
              <td className="text-start pt-2 pb-2">{item.id.trim()}</td>
              <td>
                {item.cargo_details.shipping_date.toDate().toDateString()}
              </td>
              {item.cargo_details.delivery_date === "" ? (
                <td>Pending</td>
              ) : (
                <td>{item.cargo_details.delivery_date}</td>
              )}
              <td>
                {item.cargo_details.shipping_date.toDate().toDateString()}
              </td>
              <td
                className={`text-start pt-2 pb-2 ${
                  item.status === "Delivered"
                    ? "text-[#11ED34]"
                    : item.status === "In Transit"
                    ? "text-[#ED7D1A]"
                    : item.status === "Delayed"
                    ? "text-[#E11515]"
                    : ""
                } `}
              >
                {item.status}
              </td>
              <td>
                {/* Render the modal when trackingNumber is selected */}
                {selectedTrackingNumber && (
                  <DropModel
                    trackingNumber={selectedTrackingNumber}
                    onClose={handleModalClose}
                    onUpdateStatus={handleUpdateStatus}
                  ></DropModel>
                )}
                <button onClick={() => handleEllipsisClick(item.id)}>
                  <FaEllipsisV size={20} color="grey" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableComponent;

function DropModel({ trackingNumber, onClose, onUpdateStatus, navigate }) {
  return (
    <div className="flex flex-col dropDown shadow-sm">
      <div className="w-full flex justify-end p-1">
        <button onClick={onClose}>
          <FaTimes color="black" />
        </button>
      </div>
      <ul className="flex flex-col gap-2 text-sm text-[#848185] pb-2">
        <li className="">
          {" "}
          <button onClick={() => onUpdateStatus(trackingNumber, navigate)}>
            Update Status
          </button>
        </li>
      </ul>
    </div>
  );
}
