import { useState } from 'react';
import axios from 'axios';
import { db } from '../firebase'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore';

export default function AddForm() {
  const [inputs, setInputs] = useState({
    name: '',
    surname: '',
    email: '',
    number: '',
    position: '',
    identityNumber: '',
    profilePicture: null, // To store the Base64-encoded profile picture
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));
  };

  // Convert image file to Base64
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputs((prevInputs) => ({
          ...prevInputs,
          profilePicture: reader.result // Save the Base64-encoded image
        }));
      };
      reader.readAsDataURL(file); // Read file as Data URL (Base64)
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Save employee data to Firestore with Base64-encoded profile picture
      const employeesCollection = collection(db, 'employees');
      const newEmployeeRef = await addDoc(employeesCollection, inputs);
      console.log('Employee added with ID:', newEmployeeRef.id);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-24 pb-24"> {/* Added padding to top and bottom */}
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-black text-center mb-8">Employee's Application</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {['name', 'surname', 'email', 'number', 'position', 'identityNumber'].map((field) => (
            <div key={field} className="relative">
              <label htmlFor={field} className="block text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                id={field}
                name={field}
                placeholder={field === 'identityNumber' ? 'Identity Number' : field.charAt(0).toUpperCase() + field.slice(1)}
                value={inputs[field]}
                onChange={handleChange}
                className="w-full p-3 border-b-2 border-l-2 border-pink-500 bg-transparent focus:outline-none focus:border-pink-700 shadow-sm placeholder-gray-500"
              />
            </div>
          ))}
          
          {/* Profile picture upload input */}
          <div className="relative">
            <label htmlFor="profilePicture" className="block text-gray-700">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border-b-2 border-l-2 border-pink-500 bg-transparent focus:outline-none focus:border-pink-700 shadow-sm"
            />
            {inputs.profilePicture && (
              <img
                src={inputs.profilePicture}
                alt="Profile"
                className="mt-2 w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>
          
          <button
            type="submit"
            className="w-full p-3 bg-pink-700 text-white font-semibold rounded-lg hover:bg-pink-800 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
