import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons'

type RootStackParamList = { Home: undefined, CreateListScreen: undefined, MyLists: undefined };
type MyListsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyLists'>;

export default function MyLists() {
    const navigation = useNavigation<MyListsScreenNavigationProp>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {navigation.goBack()}}>
                    <Ionicons name="arrow-back" size={32} color="#000000ff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Minhas Listas</Text>
            </View>
            <View style={styles.card}>

                <Text style={styles.title}>Informações da Lista</Text>

                <Text style={styles.title}>Nome da Lista</Text>
                <TextInput style={styles.input} placeholder="Ex: Compras do mês, Churrasco, feira" />
                <Text style={styles.line}>_________________________________________________________________</Text>
                <Text style={styles.title}>Adicionar Itens</Text>
                <Text style={styles.title}>Produto</Text>
                <TextInput style={styles.input} placeholder="Ex: Arroz, feijão, Carne" />
                <Text style={styles.title}>Quantidade(unidade/Kg)</Text>
                <TextInput style={styles.input} placeholder=" 1" />
                <TouchableOpacity style={styles.btn}><Text style={styles.btnicone}>+   Adicionar</Text></TouchableOpacity>
            </View>
            <View style={styles.card}>

                <Text style={styles.title}>Itens(0) </Text>
                {}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    line: {
        color: '#cccccc',
        marginBottom: 20,
    },
    input: {
        fontSize: 16,
        color: '#6b6b6bff',
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#cccccc',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#d1d1d1',
        borderRadius: 18,
    },
    gobackbutton: {
        fontSize: 50,
        color: '#1a1a1a',
        marginBottom: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#d5d5d5',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginLeft: 12,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '100%',
        maxWidth: 420,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        maxHeight: 500,
        minHeight: 200,
        marginTop: 28,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'left',
        marginBottom: 10,
      
    },
    subtitle: {
        fontSize: 15,
        color: '#656565ff',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        width: '100%',
        gap: 14,

    },
    btn: {
        backgroundColor: '#1b7a2b',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        height: 40,
    },
    btnText: {
        fontSize: 26,
        color: '#ffffff',
        fontWeight: 'bold',
        marginRight: 24,
    },
    btnicone: {
        fontSize: 22,
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
})
