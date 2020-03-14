import { createStackNavigator } from "react-navigation-stack";
import SearchRestaurantsScreen from "../screens/Search";

const SearchRestaurantsScreenStacks = createStackNavigator({
  SearchRestaurants: {
    screen: SearchRestaurantsScreen,
    navigationOptions: () => ({
      title: "buscar tus restaurantes"
    })
  }
});

export default SearchRestaurantsScreenStacks;
