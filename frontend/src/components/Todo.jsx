import React, { useEffect, useState } from "react";
import axios from "axios";

function Todo() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
const baseURL = process.env.REACT_APP_API_URL;
  console.log("Base URL is:", baseURL);
  async function preventDefault(e) {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    try {
      const response = await axios.post(`${baseURL}/api/addtodo`, {
        inputValue,
      });

      console.log("Inserted item:", response.data);

      setItems((prevValue) => [
        ...prevValue,
        { id: response.data.id, items: inputValue },
      ]);

      setInputValue("");
    } catch (err) {
      console.error("Error inserting todo:", err);
    }
  }

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/gettodo`);
      const data = response.data;
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error("Expected an array, but got:", data);
        setItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  fetchData();
}, [baseURL]);


  async function deleteItem(id) {
    try {
      await axios.delete(`${baseURL}/api/deltodo/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  function handleEdit(id, text) {
    setEditingId(id);
    setEditText(text);
  }

  async function handleUpdatedText(id) {
    if (editText.trim() === "") return;
    const updatedItem = items.map((item) =>
      item.id === id ? { ...item, items: editText } : item
    );

    try {
      await axios.put(`${baseURL}/api/updatetodo/${id}`, {
        text: editText,
      });
    } catch (error) {
      console.error("Error in updating elements:", error);
    }
    setItems(updatedItem);
    setEditText("");
    setEditingId(null);
  }

  function handleCancelText() {
    setEditText("");
    setEditingId(null);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-lg bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-100">
          Todo List
        </h1>
        <form
          className="flex gap-3 mb-6"
          onSubmit={preventDefault}
        >
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter items"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 px-5 py-3 rounded-lg text-white font-semibold transition hover:bg-blue-500"
          >
            ADD
          </button>
        </form>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 flex items-center justify-between p-4 rounded-xl shadow-md"
            >
              {editingId === item.id ? (
                <div className="flex w-full gap-2">
                  <input
                    className="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-green-500 outline-none"
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button
                    className="bg-green-600 px-4 py-2 rounded-lg text-white font-semibold transition hover:bg-green-500"
                    onClick={() => handleUpdatedText(item.id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-600 px-4 py-2 rounded-lg text-white font-semibold transition hover:bg-red-500"
                    onClick={handleCancelText}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex-1 text-lg">{item.items}</div>
              )}
              {editingId !== item.id && (
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 px-4 py-2 rounded-lg text-white font-semibold transition hover:bg-yellow-400"
                    onClick={() => handleEdit(item.id, item.items)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 px-4 py-2 rounded-lg text-white font-semibold transition hover:bg-red-500"
                    onClick={() => deleteItem(item.id)}
                  >
                    DEL
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Todo;
