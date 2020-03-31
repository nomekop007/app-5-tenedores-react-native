import { createStackNavigator } from "react-navigation-stack";
import FavoritesScreen from "../screens/Favorite";

const FavoriteScreenStacks = createStackNavigator({
  Favorites: {
    screen: FavoritesScreen,
    navigationOptions: () => ({
      title: "Restaurantes Favoritos"
    })
  }
});

export default FavoriteScreenStacks;
