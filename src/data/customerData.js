//deepips09 --   Hw6n9JbkG8d4WYHQ

const customers=[
    {
        cid: "CI93784", // Customer ID  
        activeCart:[],
        orderHistory:[],
        likedRestaurants:[]
    },
    {
        cid: "CI90856", // Customer ID  
        activeCart:[],
        orderHistory:[],
        likedRestaurants:[]
    }
]

//Adds a restaurant to list of liked restaurants. For a parricular customer. 
export function addLikedRestaurant(cid, restaurantId) {
    const customer = customers.find(c => c.cid === cid);
    if (customer && !customer.likedRestaurants.includes(restaurantId)) {
      customer.likedRestaurants.push(restaurantId);
    }
  }
 
//Removes a restaurant from a list of liked restautrant for a particular restaurant.   
export function removeLikedRestaurant(cid, restaurantId) {
    const customer = customers.find(c => c.cid === cid);
    if (customer) {
      customer.likedRestaurants = customer.likedRestaurants.filter(id => id !== restaurantId);
    }
}

//Adds a new item to the cart. If the restaurant or item already exists, 
// it updates the quantity. If not, it creates a new entry for the restaurant or item.
export function addItemToCart(customerId, restaurantId, restaurantName, itemId, itemName, quantity) {

  console.log("Finding customer");
  const customer = customers.find(c => c.cid === customerId);
  
  
  if (!customer) return;
  console.log("customer Found");

  // Find if the restaurant already exists in the cart
  console.log("Finding if restaurant already exists in the cart");
  let restaurantCart = customer.activeCart.find(cart => cart.restaurantId === restaurantId);

  if (!restaurantCart) {
    console.log("rest does not exist in cart, adding new");

    // If restaurant doesn't exist, add it
    customer.activeCart.push({
      restaurantId,
      restaurantName,
      items: [{ itemId, itemName, quantity }]
    });
    console.log('sucess !');
    console.log(customer.activeCart);


  } else {
    // If restaurant exists, check if the item exists
    let item = restaurantCart.items.find(i => i.itemId === itemId);

    if (item) {
      // If item exists, update its quantity
      item.quantity += quantity;
    } else {
      // If item doesn't exist, add it to the items array
      restaurantCart.items.push({ itemId, itemName, quantity });
    }
  }
}

//Updates the quantity of an item in the cart. 
// Removes the item if the quantity becomes zero.
export function updateItemQuantity(customerId, restaurantId, itemId, newQuantity) {
  const customer = customers.find(c => c.cid === customerId);

  if (!customer) return;

  const restaurantCart = customer.activeCart.find(cart => cart.restaurantId === restaurantId);

  if (restaurantCart) {
    const item = restaurantCart.items.find(i => i.itemId === itemId);

    if (item) {
      if (newQuantity > 0) {
        // Update quantity if newQuantity is positive
        item.quantity = newQuantity;
      } else {
        // Remove item if newQuantity is 0 or less
        restaurantCart.items = restaurantCart.items.filter(i => i.itemId !== itemId);
      }
    }

    // If no items are left in the restaurant's cart, remove the restaurant
    if (restaurantCart.items.length === 0) {
      customer.activeCart = customer.activeCart.filter(cart => cart.restaurantId !== restaurantId);
    }
  }
}

// Removes a specific item from the cart. If no items are left for a restaurant, 
// it removes the restaurant entry as well.
export function removeItemFromCart(customerId, restaurantId, itemId) {
  const customer = customers.find(c => c.cid === customerId);

  if (!customer) return;

  const restaurantCart = customer.activeCart.find(cart => cart.restaurantId === restaurantId);

  if (restaurantCart) {
    restaurantCart.items = restaurantCart.items.filter(i => i.itemId !== itemId);

    // If no items are left in the restaurant's cart, remove the restaurant
    if (restaurantCart.items.length === 0) {
      customer.activeCart = customer.activeCart.filter(cart => cart.restaurantId !== restaurantId);
    }
  }
}

// Clears all items from a specific restaurant in the cart.
export function clearCartForRestaurant(customerId, restaurantId) {
  const customer = customers.find(c => c.cid === customerId);

  if (!customer) return;

  // Remove the restaurant from the cart
  customer.activeCart = customer.activeCart.filter(cart => cart.restaurantId !== restaurantId);
}

// Clears all items from the cart for the customer.
export function clearAllCartItems(customerId) {
  const customer = customers.find(c => c.cid === customerId);

  if (!customer) return;

  // Clear all items in the cart
  customer.activeCart = [];
}

export default customers;
