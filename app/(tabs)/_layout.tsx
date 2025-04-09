import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { usePhotoStore } from "@/src/store/usePhotoStore";

export default function TabLayout() {
  const { loadFavorites } = usePhotoStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#18AAFF",
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Galería",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="photo-library" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritas",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite" size={24} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            loadFavorites();
          },
        }}
      />
    </Tabs>
  );
}
