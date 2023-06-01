import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const [textoInputValor, setTextoInputValor] = useState('');
  const [dados, setDados] = useState([]);

  useEffect(() => {
    getDados();
  }, []);

  const salvarValor = () => {
    const novoItem = {
      id: Date.now().toString(),
      valor: textoInputValor,
    };

    AsyncStorage.setItem(novoItem.id, novoItem.valor)
      .then(() => {
        setDados([...dados, novoItem]);
        setTextoInputValor('');
      })
      .catch((error) => console.log(error));
  };

  const getDados = () => {
    AsyncStorage.getAllKeys()
      .then((keys) => {
        return AsyncStorage.multiGet(keys);
      })
      .then((result) => {
        const dadosArmazenados = result.map((item) => ({
          id: item[0],
          valor: item[1],
        }));
        setDados(dadosArmazenados);
      })
      .catch((error) => console.log(error));
  };

  const removerValor = (itemId) => {
    AsyncStorage.removeItem(itemId)
      .then(() => {
        const novosDados = dados.filter((item) => item.id !== itemId);
        setDados(novosDados);
      })
      .catch((error) => console.log(error));
  };

  const modificarValor = (itemId, novoValor) => {
    AsyncStorage.setItem(itemId, novoValor)
      .then(() => {
        const novosDados = dados.map((item) => {
          if (item.id === itemId) {
            return {
              id: item.id,
              valor: novoValor,
            };
          } else {
            return item;
          }
        });
        setDados(novosDados);
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <Text>App com AsyncStorage</Text>
      <TextInput
        style={styles.textoInputEstilo}
        placeholder="Digite um texto..."
        value={textoInputValor}
        onChangeText={(dados) => setTextoInputValor(dados)}
      />

      <TouchableOpacity style={styles.botaoEstilo} onPress={salvarValor}>
        <Text style={styles.botaoTextoEstilo}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoEstilo} onPress={getDados}>
        <Text style={styles.botaoTextoEstilo}>Recuperar</Text>
      </TouchableOpacity>

      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TextInput
              style={styles.inputItem}
              value={item.valor}
              onChangeText={(novoValor) =>
                modificarValor(item.id, novoValor)
              }
            />
            <TouchableOpacity
              style={styles.removerBotao}
              onPress={() => removerValor(item.id)}
            >
              <Text style={styles.removerTexto}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  textoInputEstilo: {
    textAlign: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 20,
    width: '100%',
    borderRadius: 5,
  },
  botaoEstilo: {
    fontSize: 16,
    backgroundColor: 'green',
    marginTop: 16,
    padding: 5,
    width: '100%',
    borderRadius: 5,
  },
  botaoTextoEstilo: {
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removerBotao: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginLeft: 8,
  },
  removerTexto: {
    color: 'white',
    textAlign: 'center',
  },
  inputItem: {
    flex: 1,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default App;