import { View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView style={estilos.container}>
      <Text style={estilos.titulo}>App de Filmes</Text>
      

      <View style={estilos.botaoContainer}>
        <Button title="Meus Filmes" onPress={() => router.push("/sqlite")} />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  botaoContainer: {
    width: "60%",
  },
});
