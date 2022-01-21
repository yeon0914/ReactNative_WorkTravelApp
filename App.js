import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './colors';
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos"

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const addToDo = async () => {
    if (text === "")
      return;
    const newToDos = { ...toDos, [Date.now()]:{text, working}};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  }
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (e) {
      //saving error
    }
  }
  const loadToDos = async (toSave) => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      s !== null ? setToDos(JSON.parse(s)) : null;
    } catch (e) {
      //saving error
    }
  }
  const deleteToDo = async (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [{ text: "Cancel" }, {
      text: "I'm Sure", style: "destructive", onPress: async() => {
        const newToDos = { ...toDos };
        delete newToDos[key];
        setToDos(newToDos);
        await saveToDos(newToDos);
      }
    }]);
    return;
  }

  useEffect(() => {
    loadToDos();
  }, []);

  // console.log(toDos)

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: working? theme.grey : "white"}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput style={styles.input}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          onChangeText={onChangeText}
          onSubmitEditing={addToDo}
          returnKeyType="done"
          value={text}></TextInput>
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ?
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>
                {toDos[key].text}
              </Text>
              <TouchableOpacity onPress={()=>deleteToDo(key)}>
                <Text><Fontisto name="trash" size={20} color={theme.toDoTrash}></Fontisto></Text>
              </TouchableOpacity>
            </View>
            : null)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 23,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  }
});
