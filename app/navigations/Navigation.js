import React from "react";
import { Icon } from "react-native-elements";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

//importando los Stacks osea las ventanas al navegationStacks
import RestaurantsScreenStack from "./RestaurantsStacks";
import TopListsScreenStacks from "./TopListsStacks";
import SearchScreenStacks from "./SearchStacks";
import AccountScreenStacks from "./AccountStacks";

//se rellena el navigationStack con las ventanas
const NavigationStacks = createBottomTabNavigator(
  {
    Restaurants: {
      screen: RestaurantsScreenStack,
      navigationOptions: () => ({
        tabBarLabel: "Restaurantes",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            type="material-community"
            name="compass-outline"
            size={22}
            color={tintColor}
          />
        )
      })
    },
    TopLists: {
      screen: TopListsScreenStacks,
      navigationOptions: () => ({
        tabBarLabel: "Ranking",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            type="material-community"
            name="star-outline"
            size={22}
            color={tintColor}
          />
        )
      })
    },
    Search: {
      screen: SearchScreenStacks,
      navigationOptions: () => ({
        tabBarLabel: "Buscar",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            type="material-community"
            name="magnify"
            size={22}
            color={tintColor}
          />
        )
      })
    },
    Account: {
      screen: AccountScreenStacks,
      navigationOptions: () => ({
        tabBarLabel: "Cuenta",
        tabBarIcon: ({ tintColor }) => (
          <Icon
            type="material-community"
            name="home-outline"
            size={22}
            color={tintColor}
          />
        )
      })
    }
  },
  // configurar movilidad Tab
  {
    initialRouteName: "Account", //donde inica el tab
    order: ["Restaurants", "TopLists", "Search", "Account"], //orden de tabs
    tabBarOptions: {
      inactiveTintColor: "#646464", //color tabs inactivos
      activeTintColor: "#00a680" // color tab activo
    }
  }
);

export default createAppContainer(NavigationStacks);
