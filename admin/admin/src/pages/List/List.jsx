import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({url}) => {
  
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log(response.data);

      // Fixing typo from "sucess" to "success"
      if (response.data.sucess) {  
        setList(response.data.data);
      } else {
        toast.error("Error: API did not return success");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch food list");
    }
  };

  const removeFood = async(foodId) =>{
     const response = await axios.post(`${url}/api/food/remove`,{id:foodId})
     await fetchList();
     if (response.data.sucess) {
       toast.success(response.data.message)
     }
     else{
      toast.error("Error");
     }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <p onClick={()=>removeFood(item._id)} className="cursor">X</p>
            </div>
          ))
        ) : (
          <p>No food items found.</p>
        )}
      </div>
    </div>
  );
};

export default List;
