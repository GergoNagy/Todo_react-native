import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import Note from './note'
import * as firebase from 'firebase'

export default class App extends Component {
    constructor(props){
        super(props)
        this.notesRef = firebase.database().ref('shoppingList/')
        this.state = {
            noteArray: [],
            noteText: ''
        }
    }

    componentDidMount() {
        this.listenForTasks(this.notesRef);
    }

    listenForTasks(notesRef) {
        notesRef.on('value', (dataSnapshot) => {
            var notes = [];
            dataSnapshot.forEach((child) => {
                notes.push({
                    note: child.val().date,
                    date: child.val().note,
                    _key: child.key
                })
                console.log('child', child)
            })
            this.setState({
                noteArray: notes
            })
        });
    }

    render() {
        console.log('notarray ', this.state.noteArray)
        let notes = this.state.noteArray.map((val, key) => {
            console.log('val', val)
            return <Note key={key} keyval={key} val={val} 
            deleteMethod={ ()=> this.deleteNote(val, key)}/>
        })

        return (
            <View style={styles.container} >

                <View style={styles.header}>
                    <Text style={styles.headerText}> - ToDo List - </Text>
                </View>

                <ScrollView style={styles.scrollContainer}>
                    {notes}
                </ScrollView>

                <View style={styles.footer}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(noteText) => this.setState({noteText})}
                        value={this.state.noteText}
                        placeholder = 'note'
                        placeholderTextColor='white'
                        underlineColorAndroid='transparent'>
                    </TextInput>
                </View>

                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={this.addNote.bind(this)}
                    >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        );
    }

    addNote() {
        if (this.state.noteText) {
            var d = new Date()
            this.notesRef.push({
                'date': d.getFullYear() +
                "/" + (d.getMonth() + 1) +
                "/" + d.getDate(),
                'note': this.state.noteText
            })
            this.setState({noteText: ''})
        }
    }

    deleteNote(val, key) {
        this.notesRef.child(val._key).remove()
        this.state.noteArray.splice(key, 1)
        this.setState({noteArray: this.state.noteArray})
    }

}


const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    header: {
        backgroundColor: '#518D97',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 10,
        borderBottomColor: '#128294'
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        padding: 26
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 100
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10
    },
    textInput: {
        alignSelf: 'stretch',
        color: '#fff',
        padding: 20,
        backgroundColor: '#252525',
        borderTopWidth: 2,
        borderTopColor: '#ededed'
    },
    addButton: {
        position: 'absolute',
        zIndex: 11,
        right: 20,
        bottom: 90,
        backgroundColor: '#518D97',
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24
    }
})