import { createContext, useState, useCallback, useEffect } from "react";
import axios from 'axios';


// Named export for context
export const StoreContext = createContext(null);

const StoreContextProvider =  ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-del-backend-6n2n.onrender.com"
  const [token,setToken] = useState("");
  const [food_list,setFoodList] = useState([])


  // Use useCallback to avoid re-creating the function on every render
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 })) 
      
    }
    else{
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1}))
    }
    if (token) {
       await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url+"/api/cart/remove",{itemId},{headers:token})
    }
  }

  const getTotalCartAmount = useCallback(() => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo ? itemInfo.price * cartItems[item] : 0;
      }
    }
    return totalAmount;
  });

  const fetchFoodList = async () => {
    const response = await axios.get(url+"/api/food/list");
    setFoodList(response.data.data)
  }

  const loadCartData = async (token)=>{
  const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
  setCartItems(response.data.cartData);
  }
  useEffect(()=>{
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  },[])

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
    
    
    
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
