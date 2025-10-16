
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, initDb } from "../data/db";
import { useRouter } from "expo-router";

initDb();

function getFilmes() {
  return db.getAllSync("SELECT * FROM filmes ORDER BY id DESC");
}

function insertFilmes(titulo, genero, ano ) {
  db.runSync(
    "INSERT INTO filmes (titulo, genero, ano) VALUES (?, ?, ?)",
    [titulo, genero, ano]
  );
}

function updateFilmes(id, titulo, genero, ano) {
  db.runSync(
    "UPDATE filmes SET titulo = ?, genero = ?, ano = ? WHERE id = ?;",
    [titulo, genero, ano, id]
  );
}

function deleteFilmes(id) {
  db.runSync("DELETE FROM filmes WHERE id = ?;", [id]);
}

export default function FilmesScreen() {
  const router = useRouter();
  const [lista, setLista] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState("");
  const [ano, setAno] = useState("");
  const [editingId, setEditingId] = useState(null);

  function carregar() {
    try {
      const rows = getFilmes();
      setLista(rows ?? []);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function validarCampos() {
    if (!titulo || titulo.trim() === "") {
      Alert.alert("Erro", "Titulo não pode ficar vazio.");
      return false;
    
    }
    return true;
  }

  function onSalvar() {
    if (!validarCampos()) return;
    if (editingId) {
      updateFilmes(editingId, titulo.trim(), genero.trim(), ano.trim());
      setEditingId(null);
    } else {
      insertFilmes(titulo.trim(), genero.trim(), ano.trim());
    }
    setTitulo("");
    setGenero("");
    setAno();
    carregar("");
  }

  function onEditar(item) {
    setEditingId(item.id);
    setTitulo(item.titulo);
    setGenero(item.genero);
    setAno(item.ano);
   
  }

  function onExcluir(id) {
    Alert.alert("Confirmar", "Deseja excluir este filme?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          deleteFilmes(id);
          if (editingId === id) {
            setEditingId(null);
            setTitulo("");
            setGenero("");
            setAno("");
          }
          carregar();
        },
      },
    ]);
  }

  const renderItem = ({ item }) => (
    <View style={styles.linha}>
      <View style={{ flex: 1 }}>
        <Text style={styles.titulo}>{item.titulo} ({item.ano})</Text>
        <Text>{item.genero} </Text>
      </View>
      <View style={styles.acoesLinha}>
        <TouchableOpacity onPress={() => onEditar(item)} style={styles.botaoPequeno}>
          <Text style={styles.botaoTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onExcluir(item.id)} style={[styles.botaoPequeno, { backgroundColor: "#ff4444" }]}>
          <Text style={styles.botaoTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Cadastro de Filmes</Text>

        <TextInput
          placeholder="Titulo (ex: Tarzan)"
          value={titulo}
          onChangeText={setTitulo}
          style={styles.input}
        />
        <TextInput
          placeholder="Genero (ex: Ação)"
          value={genero}
          onChangeText={setGenero}
          style={styles.input}
        />
        <TextInput
          placeholder="Ano (ex: 1998)"
          value={ano}
          onChangeText={setAno}
          style={styles.input}
        />
       

        <View style={styles.rodape}>
          <Button title={editingId ? "Atualizar" : "Salvar"} onPress={onSalvar} />
          <Button title="Limpar" onPress={() => { setEditingId(null); setTitulo(""); setGenero(""); setAno(""); }} />
          <Button title="Novo (voltar)" onPress={() => router.back()} />
        </View>
      </View>

      <View style={{ marginTop: 16, flex: 1 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Lista de filmes</Text>
        <FlatList
          data={lista}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={() => <Text>Nenhum filme salvo.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
    borderRadius: 6,
  },
  linha: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titulo: { fontWeight: "700" },
  acoesLinha: {
    flexDirection: "column",
    gap: 6,
    marginLeft: 8,
  },
  botaoPequeno: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#333",
  },
  botaoTexto: { color: "#fff" },
  rodape: { flexDirection: "row", gap: 8, marginTop: 8, justifyContent: "space-between" },
});
