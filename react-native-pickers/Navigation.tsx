import React, { useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
} from 'react-native';

const PALETTE = {
  REACT_CYAN_LIGHT: 'hsl(193, 95%, 68%)',
  REACT_CYAN_DARK: 'hsl(193, 95%, 30%)',
};

const NavigationContext = React.createContext<
  | {
    currentPageName: string;
    navigateTo: (pageName: string) => void;
    registerPageName: (pageName: string) => void;
    registeredPageNames: string[];
  }
  | undefined
>(undefined);

export function NavigationContainer({
  initialPage = 'INDEX',
  children,
}: {
  initialPage?: string;
  children: any;
}) {
  const [currentPageName, setCurrentPageName] = React.useState(initialPage);
  const [registeredPageNames, setRegisteredPageNames] = React.useState<
    string[]
  >([]);

  return (
    <NavigationContext.Provider
      value={{
        currentPageName,
        navigateTo: setCurrentPageName,
        registerPageName: (pageName: string) => {
          setRegisteredPageNames(pageNames => {
            if (pageNames.includes(pageName)) {
              return pageNames;
            }
            return [...pageNames, pageName];
          });
        },
        registeredPageNames,
      }}>
      <View style={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <Page name="INDEX">
          <IndexPage />
        </Page>
        {children}
      </View>
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return React.useContext(NavigationContext)!;
}

export function Page({ name, children }: { name: string; children: any }) {
  const { currentPageName, navigateTo, registerPageName } = useNavigation();

  useEffect(() => {
    if (name !== 'INDEX') {
      registerPageName(name);
    }
  }, [name]);

  return name === currentPageName ? (
    <View style={{ width: '100%', height: '100%' }}>
      {name !== 'INDEX' && (
        <View style={{ backgroundColor: PALETTE.REACT_CYAN_DARK }}>
          <TouchableOpacity
            onPress={() => {
              navigateTo('INDEX');
            }}>
            <Text
              style={[styles.buttonText, { color: PALETTE.REACT_CYAN_LIGHT }]}>
              ‹ Back
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ width: '100%', flex: 1 }}>{children}</View>
    </View>
  ) : null;
}

export function IndexPage() {
  const { navigateTo, registeredPageNames } = useNavigation();

  return (
    <FlatList
      data={registeredPageNames}
      renderItem={({ item }) => {
        return (
          <View style={styles.indexPage}>
            <Button
              title={item}
              onPress={() => {
                navigateTo(item);
              }}
            />
          </View>
        );
      }}
      ItemSeparatorComponent={() => (
        <View
          style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#666' }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  indexPage: {
    margin: 10,
    // borderRadius: 6,
  },
  buttonText: {
    width: '100%',
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: 'white',
    backgroundColor: 'black',
  },
});
