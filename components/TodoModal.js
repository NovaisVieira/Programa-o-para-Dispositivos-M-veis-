import React from 'react'
import { Animated, Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import color from '../Colors'
import { SwipeListView } from 'react-native-swipe-list-view'

export default class TodoModal extends React.Component {
    state = {
        newTodo: ''
    }

    toggleTodoCompleted = index => {
        let list = this.props.list
        list.todos[index].completed = !list.todos[index].completed

        this.props.updateList(list);
    }

    addTodo = () => {
        let list = this.props.list
        list.todos.push({title: this.state.newTodo, completed: false})

        this.props.updateList(list)
        this.setState({newTodo: ''})

        Keyboard.dismiss()
    }

    deleteTodo = index => {
        let list = this.props.list
        list.todos.splice(index, 1)
        this.props.updateList(list)
    }

    renderTodo = ({ item, index }) => {
        return (
            <View style={styles.todoContainer}>
                <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                    <Ionicons name={item.completed ? 'square' : 'square-outline'} size={24} color={color.gray} style={{width: 32}} />
                </TouchableOpacity>
                <Text style={[styles.todo, {textDecorationLine: item.completed ? 'line-through' : 'none', color: item.completed ? color.gray : color.black}]}>{item.title}</Text>
            </View>
        )
    }

    renderHiddenItem = (data) => {
        const index = data.index
        const fadeAnim = new Animated.Value(0) // Valor inicial de opacidade

        // Animação de fade-in
        Animated.timing(fadeAnim, {
            toValue: 1, // Opacidade final
            duration: 300, // Duração da animação
            useNativeDriver: true,
        }).start()

        return (
            <View style={styles.hiddenContainer}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => this.deleteTodo(index)}>
                        <Text style={styles.deleteText}>Deletar</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        )
    }

    render() {
        const list = this.props.list
        const taskCount = list.todos.length
        const completedCount = list.todos.filter(todo => todo.completed).length

        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior='padding'>
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity style={{position: 'absolute', top: 64, right: 32, zIndex: 10}} onPress={this.props.closeModal}>
                        <AntDesign name='close' size={24} color={color.black}/>
                    </TouchableOpacity>

                    <View style={[styles.section, styles.header, {borderBottomColor: list.color}]} >
                        <Text style={styles.title}>{list.name}</Text>
                        <Text style={styles.taskCount}>
                            {completedCount} de {taskCount} tarefas
                        </Text>
                    </View>

                    <View style={[styles.section, {flex: 3}]}>
                        <SwipeListView
                            data={list.todos}
                            renderItem={this.renderTodo}
                            renderHiddenItem={this.renderHiddenItem}
                            rightOpenValue={-75} // Ajuste para deslizar para a esquerda
                            keyExtractor={item => item.title}
                            contentContainerStyle={{paddingHorizontal: 32, paddingVertical: 64}}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                    <View style={[styles.section, styles.footer]}>
                        <TextInput 
                            style={[styles.input, {borderColor: list.color}]} 
                            onChangeText={text => this.setState({newTodo: text})} 
                            value={this.state.newTodo} 
                        />
                        <TouchableOpacity 
                            style={[styles.addTodo, {backgroundColor: list.color}]} 
                            onPress={this.addTodo}
                        >
                            <AntDesign name='plus' size={16} color={color.white}/>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
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
    section: {
        flex: 1,
        alignSelf: 'stretch'
    },
    header: {
        justifyContent: 'flex-end',
        marginLeft: 64,
        borderBottomWidth: 3
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: color.black
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: color.gray,
        fontWeight: '600'
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    todo: {
        color: color.black,
        fontWeight: '700',
        fontSize: 16
    },
    hiddenContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'red'
    },
    deleteButton: {
        width: 75,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    deleteText: {
        color: 'white',
        fontWeight: '600'
    }
}) 