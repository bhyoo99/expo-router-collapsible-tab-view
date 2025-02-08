import {
  MaterialTopTabBar,
  MaterialTopTabBarProps,
  MaterialTopTabView,
} from "@react-navigation/material-top-tabs";
import { NavigationHelpersContext, TabActions, useTheme } from "@react-navigation/native";
import * as React from "react";
import { SceneRendererProps } from "react-native-tab-view";

import CollapsibleTabView, { Props as CollapsibleTabViewProps } from "./CollapsibleTabView";

export type MaterialTopTabsCollapsibleTabViewProps = Parameters<typeof MaterialTopTabView>[0] & {
  collapsibleOptions?: Partial<CollapsibleTabViewProps<any>>;
};

export default function MaterialTopTabsCollapsibleTabView({
  pager,
  lazyPlaceholder,
  tabBar = (props: MaterialTopTabBarProps) => <MaterialTopTabBar {...props} />,
  tabBarOptions,
  state,
  navigation,
  descriptors,
  sceneContainerStyle,
  collapsibleOptions,
  ...rest
}: MaterialTopTabsCollapsibleTabViewProps) {
  const { colors } = useTheme();

  const renderTabBar = (props: SceneRendererProps) => {
    return tabBar({
      ...tabBarOptions,
      ...props,
      state: state,
      navigation: navigation,
      descriptors: descriptors,
    });
  };

  return (
    <NavigationHelpersContext.Provider value={navigation}>
      <CollapsibleTabView
        {...collapsibleOptions}
        {...rest}
        routeKeyProp="name"
        onIndexChange={(index) =>
          navigation.dispatch({
            ...TabActions.jumpTo(state.routes[index].name),
            target: state.key,
          })
        }
        renderScene={({ route }) => descriptors[route.key].render()}
        navigationState={state}
        renderTabBar={renderTabBar}
        renderLazyPlaceholder={lazyPlaceholder}
        onSwipeStart={() => navigation.emit({ type: "swipeStart" })}
        onSwipeEnd={() => navigation.emit({ type: "swipeEnd" })}
        sceneContainerStyle={[{ backgroundColor: colors.background }, sceneContainerStyle]}
      />
    </NavigationHelpersContext.Provider>
  );
}
