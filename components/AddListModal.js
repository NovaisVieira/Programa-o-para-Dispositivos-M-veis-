import React from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import color from '../Colors'

export default class AddListModal extends React.Component {
    backgroundColors = ['#5cd859', "#000", '#24a6d9', '#595bd9', '#8022d9', '#d159d8', '#d859d8', '#f49e12'];

    state = {
        name: '',
        color: this.backgroundColors[0]
    }

    createTodo = () => {
        const {name, color} = this.state

        const list = {name, color}

        this.props.addList(list)

        this.setState({name: ''})
        this.props.closeModal()
    }

    renderColors() {
        return this.backgroundColors.map(color => {
            return (
                <TouchableOpacity key={color} style={[styles.colorSelect, {backgroundColor: color}]} onPress={() => this.setState({color})} />
            )
        })
    }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <TouchableOpacity style={{position: 'absolute', top: 64, right: 32}} onPress={this.props.closeModal}>
            <AntDesign name='close' size={24} color={color.black}/>
        </TouchableOpacity>

        <View style={{alignSelf: 'stretch', marginHorizontal: 32}}>
            <Text style={styles.title}>Criar Lista</Text>
            <TextInput style={styles.input} placeholder="Nome da Lista" onChangeText={text => this.setState({name: text})} />

            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 12}}>
                {this.renderColors()}
            </View>

            <TouchableOpacity style={[styles.create, {backgroundColor: this.state.color}]} onPress={this.createTodo}>
                <Text style={{color: color.white, fontWeight: '600'}}>Criar</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: color.black,
    alignSelf: 'center',
    marginTop: 16
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.blue,
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 18
  },
  create: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 4
  }
})

