import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons'

type RootStackParamList = { Home: undefined, CreateListScreen: undefined, MyLists: undefined };
type CreateListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateListScreen'>;

export default function CreateListScreen() {
    const navigation = useNavigation<CreateListScreenNavigationProp>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {navigation.goBack()}}>
                    <Ionicons name="arrow-back" size={32} color="#000000ff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nova Lista de Compras</Text>
            </View>
            <View style={styles.card}>

                <Text style={styles.title}>Informações da Lista</Text>

                <Text style={styles.title}>Nome da Lista</Text>
                <TextInput style={styles.input} placeholder="Ex: Compras do mês, Churrasco, feira" />
                <View style={styles.divider} />
                <Text style={styles.title}>Adicionar Itens</Text>
                <View style={styles.row}>
                    <View style={styles.productColumn}>
                        <Text style={styles.title}>Produto</Text>
                        <TextInput style={styles.input} placeholder="Ex:Arroz , feijão, Carne" />
                    </View>
                    <View style={styles.quantityColumn}>
                        <Text style={styles.title}>Qtd</Text>
                        <TextInput style={styles.inputSmall} placeholder="1" keyboardType="numeric" />
                    </View>
                </View>
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
    divider: {
        height: 1,
        backgroundColor: '#cccccc',
        marginVertical: 20,
        width: '100%',
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
        height: 45,
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
        marginTop: 10,
    },
    headerTitle: {
        marginTop: 10,
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
        alignSelf: 'center',
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
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        marginBottom: 10,
    },
    productColumn: {
        flex: 3,
    },
    quantityColumn: {
        flex: 1,
    },
    inputSmall: {
        fontSize: 16,
        color: '#6b6b6bff',
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        backgroundColor: '#d1d1d1',
        borderRadius: 18,
        textAlign: 'center',
        marginBottom: 10,
        height: 45,
    },
})
