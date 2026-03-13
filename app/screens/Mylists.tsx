import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { carregarListas, Lista, DeletarLista, CopiarLista } from '../src/services/storage';

type RootStackParamList = {
  Home: undefined,
  CreateListScreen: undefined,
  MyLists: undefined,
  ListDetails: { listId: string }
};

type MyListsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyLists'>;

export default function MyLists() {

    const navigation = useNavigation<MyListsScreenNavigationProp>();

    const [listas, setListas] = useState<Lista[]>([]);
    const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);

    const carregar = useCallback(async () => {
        const resultado = await carregarListas();
        setListas(resultado);
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    function formatarData(dataIso: string) {
        const data = new Date(dataIso);

        if (Number.isNaN(data.getTime())) {
            return '';
        }

        return data.toLocaleDateString('pt-BR');
    }

    function formatarPreco(total: number) {
        const valor = total.toFixed(2).replace('.', ',');
        return `R$ ${valor}`;
    }

    function calcularTotalPreco(lista: Lista) {
        const total = lista.itens.reduce((acc, item) => {

            if (!item.price || item.price <= 0) {
                return acc;
            }

            return acc + item.price * item.quantity;

        }, 0);

        return total > 0 ? formatarPreco(total) : '';
    }

    function contarMarcados(lista: Lista) {
        return lista.itens.filter((item) => item.completed).length;
    }

    function toggleMenu(id: string) {
        setOpenedMenuId((prev) => (prev === id ? null : id));
    }

    async function handleCopy(id: string) {

        await CopiarLista(id);

        setOpenedMenuId(null);

        carregar();
    }

    async function handleDelete(id: string) {

        Alert.alert(
            'Excluir lista',
            'Tem certeza que deseja excluir esta lista?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {

                        await DeletarLista(id);

                        setOpenedMenuId(null);

                        carregar();
                    }
                }
            ]
        );
    }

    return (

        <View style={styles.container}>

            <View style={styles.header}>

                <View style={styles.headerLeft}>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Minhas Listas</Text>

                </View>

                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => navigation.navigate('CreateListScreen')}
                >
                    <Ionicons name="cart" size={18} color="#ffffff" />
                    <Text style={styles.headerButtonText}>Nova Lista</Text>
                </TouchableOpacity>

            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                {listas.map((lista) => (

                    <View key={lista.id} style={styles.listCard}>

                        <View style={styles.cardTopRow}>

                            <TouchableOpacity
                                style={styles.cardTitleRowTouchable}
                                onPress={() => navigation.navigate('ListDetails', { listId: lista.id })}
                                activeOpacity={0.85}
                            >

                                <View style={styles.cardTitleRow}>

                                    <Text style={styles.listTitle}>
                                        {lista.title}
                                    </Text>

                                    {!lista.completed && (

                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>Ativa</Text>
                                        </View>

                                    )}

                                </View>

                            </TouchableOpacity>

                            <View style={styles.menuWrapper}>

                                <TouchableOpacity
                                    onPress={() => toggleMenu(lista.id)}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Ionicons name="ellipsis-vertical" size={18} color="#111" />
                                </TouchableOpacity>

                                {openedMenuId === lista.id && (

                                    <View style={styles.menuContainer}>

                                        <TouchableOpacity
                                            style={styles.menuButton}
                                            onPress={() => handleCopy(lista.id)}
                                        >
                                            <Text style={styles.menuButtonText}>
                                                Copiar Lista
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.menuButton}
                                            onPress={() => handleDelete(lista.id)}
                                        >
                                            <Text style={styles.menuButtonText}>
                                                Excluir Lista
                                            </Text>
                                        </TouchableOpacity>

                                    </View>

                                )}

                            </View>

                        </View>

                        <Text style={styles.listDate}>
                            Criada em {formatarData(lista.date)}
                        </Text>

                        <View style={styles.cardBottomRow}>

                            <Text style={styles.listProgress}>
                                {contarMarcados(lista)}/{lista.itens.length} Itens marcados
                            </Text>

                            {!!calcularTotalPreco(lista) && (

                                <Text style={styles.listPrice}>
                                    {calcularTotalPreco(lista)}
                                </Text>

                            )}

                        </View>

                    </View>

                ))}

            </ScrollView>

        </View>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#d5d5d5',
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 20,
    },

    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginLeft: 10,
    },

    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1b7a2b',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        gap: 6,
        height: 50,
        marginTop: 10,
    },

    headerButtonText: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: 'bold',
    },

    content: {
        paddingBottom: 20,
        gap: 16,
    },

    listCard: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#8f8f8f',
        overflow: 'visible',
    },

    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    cardTitleRowTouchable: {
        flex: 1,
    },

    menuWrapper: {
        position: 'relative',
        alignItems: 'flex-end',
        zIndex: 100,
    },

    menuContainer: {
        position: 'absolute',
        top: 24,
        right: 0,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#cfcfcf',
        borderRadius: 8,
        overflow: 'hidden',
        minWidth: 160,
        elevation: 10,
        zIndex: 100,
    },

    menuButton: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        zIndex: 101,
        elevation: 11,
    },

    menuButtonText: {
        color: '#333',
        fontWeight: '600',
    },

    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },

    badge: {
        backgroundColor: '#0a7a38',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },

    badgeText: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: 'bold',
    },

    listDate: {
        fontSize: 12,
        color: '#8f8f8f',
        marginTop: 4,
    },

    cardBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },

    listProgress: {
        fontSize: 14,
        color: '#3d3d3d',
    },

    listPrice: {
        fontSize: 16,
        color: '#2f7d32',
        fontWeight: 'bold',
    },

});