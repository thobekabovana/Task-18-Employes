import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function List() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  // Fetch employee data when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/employees'); // Adjust URL based on your server
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setEmployees(response.data);
        } else {
          console.error('Expected an array of employees, but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []); // Empty dependency array means this effect runs once on component mount

  // Handle view
  const handleView = (id) => {
    navigate(`/view/${id}`); // Navigate to the View page with employee ID
  };

  return (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 flex justify-center">
      {/* Center the content using flex */}
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">Employees List</h2>
        {employees.length === 0 ? (
          <p className="text-center text-gray-500">No employees found.</p>
        ) : (
          employees.map((employee) => (
            <div key={employee.identityNumber} className="bg-white p-6 rounded-lg shadow-lg mb-4 w-full">
              <div className="flex items-center space-x-4">
                {/* Profile picture as a circular thumbnail */}
                {employee.profilePicture && (
                  <img
                    src={employee.profilePicture} // Assuming profilePicture is a URL or Base64 string
                    alt={`${employee.name} ${employee.surname}'s profile`}
                    className="w-12 h-12 rounded-full object-cover" // Circular thumbnail styling
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{employee.name} {employee.surname}</h3>
                  <p className="text-gray-500">{employee.identityNumber}</p>
                </div>
                <button 
                  className="bg-pink-600 text-white px-4 py-2 rounded shadow-md hover:bg-pink-700"
                  onClick={() => handleView(employee.id)}>
                  View
                </button>
              </div>
              <div className="w-full bg-pink-300 h-1 shadow-lg mt-4"></div> {/* Pink line under employee info */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
