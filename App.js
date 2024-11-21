import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, Alert } from "react-native";
import colors from "./Colors";
import { AntDesign } from '@expo/vector-icons';
import TodoList from "./components/TodoList";
import AddListModal from "./components/AddListModal";
import Fire from './Fire';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

export default class App extends React.Component {
  state = {
    addTodoVisible: false,
    lists: [], // Inicializa lists como um array vazio
    user: {}
  };

  componentDidMount() {
    this.firebase = new Fire((error, user) => {
      if (error) {
        return alert('Error');
      }

      this.setState({ user }, () => {
        this.firebase.getLists(this.updateLists);
      });
    });
  }

  componentWillUnmount() {
    this.firebase.detach();
  }

  toggleAddTodoModal = () => {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  };

  // Função que lida com o gesto de deslizar para cima
  handleGestureEvent = ({ nativeEvent }, item) => {
    if (nativeEvent.translationY < -50) {  // Detecta o deslizar para cima
      this.showDeleteAlert(item);
    }
  };

  // Função que exibe o alerta de confirmação
  showDeleteAlert = (item) => {
    Alert.alert(
      "Excluir Lista",
      "Tem certeza que deseja excluir esta lista?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Exclusão cancelada"),
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: () => this.deleteList(item.id),  // Passa o id corretamente
        }
      ]
    );
  };

  // Função que confirma a exclusão
  deleteList = (listId) => {
    // Remova a lista do estado
    const updatedLists = this.state.lists.filter(list => list.id !== listId);
    this.setState({ lists: updatedLists });

    // Agora, remova a lista do Firebase
    this.firebase.deleteList(listId);
  };

  addList = list => {
    this.firebase.addList({
      name: list.name,
      color: list.color,
      todos: []
    });
  };

  updateList = list => {
    this.firebase.updateList(list);
  };

  updateLists = lists => {
    // Verifique se lists é um array antes de atualizar
    if (Array.isArray(lists)) {
      this.setState({ lists });
    } else {
      console.error('O retorno de getLists não é um array válido:', lists);
    }
  };

  renderList = (list) => {
    return (
      <PanGestureHandler
        onHandlerStateChange={(event) => this.handleGestureEvent(event, list)} // Passando 'list' corretamente
        activeOffsetY={[-10, 10]} // Adiciona uma pequena zona de "detecção"
      >
        <View style={styles.listItem}>
          <TodoList list={list} updateList={this.updateList} />
        </View>
      </PanGestureHandler>
    );
  };

  render() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Modal para adicionar nova lista */}
          <Modal
            animationType='slide'
            visible={this.state.addTodoVisible}
            onRequestClose={() => this.toggleAddTodoModal()}
          >
            <AddListModal closeModal={() => this.toggleAddTodoModal()} addList={this.addList} />
          </Modal>

          <View style={{ flexDirection: 'row' }}>
            <View style={styles.divider} />
            <Text style={styles.title}>
              Todo<Text style={{ fontWeight: '300', color: colors.blue }}>Lists</Text>
            </Text>
            <View style={styles.divider} />
          </View>

          <View style={{ marginVertical: 48 }}>
            <TouchableOpacity style={styles.AddList} onPress={() => this.toggleAddTodoModal()}>
              <AntDesign name="plus" size={16} color={colors.blue} />
            </TouchableOpacity>
            <Text style={styles.add}>Add Lista</Text>
          </View>

          <View style={{ height: 275, paddingLeft: 32 }}>
            <FlatList
              data={this.state.lists || []} // Adiciona um fallback vazio para 'lists'
              keyExtractor={item => item.id ? item.id : item.name} // Usa 'name' ou outro identificador seguro
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => this.renderList(item)}
              keyboardShouldPersistTaps="always"
            />
          </View>
        </View>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: 'center'
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.black,
    paddingHorizontal: 64
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  AddList: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  add: {
    color: colors.blue,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8
  },
  listItem: {
    marginRight: 16,
    position: 'relative'
  },
});
