import * as React from "react";
import { Appbar, Menu } from "react-native-paper";
import { useHistory } from "react-router-native";

export function AppBar({
  signOut,
  backButton = false,
  signOutMenu = false,
  title,
}) {
  const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";
  const [visible, setVisible] = React.useState(false);

  const toggleMenu = () => setVisible(!visible);
  const history = useHistory();

  return (
    <Appbar>
      {backButton && <Appbar.BackAction onPress={() => history.goBack()} />}
      <Appbar.Content title={title} />

      {signOutMenu && (
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Appbar.Action
              color="white"
              icon={MORE_ICON}
              onPress={toggleMenu}
            />
          }
        >
          <Menu.Item onPress={() => signOut()} title="Cerrar Sesion" />
        </Menu>
      )}
    </Appbar>
  );
}
