

const restaurants = [
    {
        id: 531993847991,
        name: "Pizza Paradise",
        location: "123 Main St, Springfield",
        cuisine: "Italian",
        rating: 4.5,
        deliveryTime: "30-45 mins",
        deliveryFee: "$5",
        image:"./images/pizza.jpg"
      },
      {
        id: 153265296795,
        name: "Sushi World",
        location: "456 Elm St, Springfield",
        cuisine: "Japanese",
        rating: 4.7,
        deliveryTime: "20-30 mins",
        deliveryFee: "$5",
        image:"./images/sushi_world.jpg"
      },
      {
        id: 701368657879,
        name: "mcDonald's",
        location: "456 Elm St, Springfield",
        cuisine: "Japanese",
        rating: 4.7,
        deliveryTime: "20-30 mins",
        deliveryFee: "$5",
        image:"./images/mcdonald's.jpg"
      },
      {
        id: 362430152588,
        name: "Subway",
        location: "123 Main St, Springfield",
        cuisine: "Italian",
        rating: 4.5,
        deliveryTime: "30-45 mins",
        deliveryFee: "$5",
        image:"./images/subway.jpg"
      },
      {
        id: 994920829501,
        name: "Bar Burrito",
        location: "456 Elm St, Springfield",
        cuisine: "Japanese",
        rating: 4.7,
        deliveryTime: "20-30 mins",
        deliveryFee: "$5",
        image:"./images/bar_burrito.jpg"
      },
      {
        id: 893507913756,
        name: "Khab Tapioca",
        location: "456 Elm St, Springfield",
        cuisine: "Japanese",
        rating: 4.7,
        deliveryTime: "20-30 mins",
        deliveryFee: "$5",
        image:"./images/khab_tapioca.jpg"
      }
];

export function getRestaurants(){
  return restaurants;
};

export function getRestaurantNameByID(id){
  console.log('id is ',id);
  console.log(typeof(id));
  const restaurant = restaurants.find((restaurant) => restaurant.id.toString() === id);
  console.log("In the restaurant.js ", restaurant.name);
  return restaurant ? restaurant.name : null;
};