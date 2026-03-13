import { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { carregarListas, Item, Lista, salvarLista } from '../src/services/storage';

type RootStackParamList = { Home: undefined, CreateListScreen: undefined, MyLists: undefined, ListDetails: { listId: string } };
type ListDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'ListDetails'>;
type ListDetailsRouteProp = RouteProp<RootStackParamList, 'ListDetails'>;

export default function ListDetails() {
	const navigation = useNavigation<ListDetailsNavigationProp>();
	const route = useRoute<ListDetailsRouteProp>();
	const { listId } = route.params;

	const [lista, setLista] = useState<Lista | null>(null);
	const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});

	const carregar = useCallback(async () => {
		const listas = await carregarListas();
		const encontrada = listas.find((l) => l.id === listId) ?? null;
		setLista(encontrada);
		if (encontrada) {
			setPriceInputs((prev) => {
				const next = { ...prev };
				encontrada.itens.forEach((item) => {
					if (next[item.id] === undefined) {
						next[item.id] = item.price ? formatarPrecoInput(item.price) : '';
					}
				});
				return next;
			});
		}
	}, [listId]);

	useFocusEffect(
		useCallback(() => {
			carregar();
		}, [carregar])
	);

	const itens = lista?.itens ?? [];
	const itensMarcados = useMemo(() => itens.filter((item) => item.completed).length, [itens]);
	const progresso = useMemo(() => (itens.length === 0 ? 0 : itensMarcados / itens.length), [itens, itensMarcados]);

	const totalPreco = useMemo(() => {
		return itens.reduce((acc, item) => {
			if (!item.price || item.price <= 0) {
				return acc;
			}
			return acc + item.price * item.quantity;
		}, 0);
	}, [itens]);

	function formatarPrecoInput(valor: number) {
		return valor.toFixed(2).replace('.', ',');
	}

	function formatarPreco(valor: number) {
		const formatado = valor.toFixed(2).replace('.', ',');
		return `R$ ${formatado}`;
	}

	function atualizarLista(novosItens: Item[]) {
		if (!lista) {
			return;
		}
		const atualizada = { ...lista, itens: novosItens };
		setLista(atualizada);
		salvarLista(atualizada.id, atualizada.title, atualizada.itens, atualizada.date);
	}

	function toggleItem(itemId: string) {
		const novosItens = itens.map((item) => {
			if (item.id !== itemId) {
				return item;
			}
			return { ...item, completed: !item.completed };
		});
		atualizarLista(novosItens);
	}

	function atualizarPrecoTexto(itemId: string, texto: string) {
		setPriceInputs((prev) => ({ ...prev, [itemId]: texto }));
	}

	function salvarPreco(itemId: string) {
		const texto = priceInputs[itemId] ?? '';
		const normalizado = texto.replace(/[\sR$]/g, '').replace(',', '.');
		const valor = normalizado.length ? Number(normalizado) : NaN;
		const novosItens = itens.map((item) => {
			if (item.id !== itemId) {
				return item;
			}
			return { ...item, price: Number.isNaN(valor) ? undefined : valor };
		});
		atualizarLista(novosItens);
	}  

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<TouchableOpacity onPress={() => {navigation.goBack()}}>
						<Ionicons name="arrow-back" size={28} color="#000000ff" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{lista?.title ?? 'Lista'}</Text>
					{!lista?.completed && (
						<View style={styles.badge}>
							<Text style={styles.badgeText}>Ativa</Text>
						</View>
					)}
				</View>
				<TouchableOpacity style={styles.headerButton} onPress={() => {}}>
					<Ionicons name="pencil" size={16} color="#ffffff" />
					<Text style={styles.headerButtonText}>Editar Lista</Text>
				</TouchableOpacity>
			</View>

			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.summaryCard}>
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Progresso da compra</Text>
						<Text style={styles.summaryValue}>{itensMarcados}/{itens.length} Itens</Text>
					</View>
					<View style={styles.progressTrack}>
						<View style={[styles.progressFill, { width: `${Math.round(progresso * 100)}%` }]} />
					</View>
					<View style={styles.summaryRowBottom}>
						<Text style={styles.totalLabel}>Total :</Text>
						<Text style={styles.totalValue}>{totalPreco > 0 ? formatarPreco(totalPreco) : 'R$ 0,00'}</Text>
					</View>
				</View>

				<View style={styles.itemsCard}>
					{itens.length === 0 ? (
						<Text style={styles.emptyText}>Nenhum item adicionado.</Text>
					) : (
						itens.map((item) => (
							<View
								key={item.id}
								style={[styles.itemRow, item.completed ? styles.itemRowCompleted : styles.itemRowDefault]}
							>
								<TouchableOpacity
									style={[styles.checkbox, item.completed && styles.checkboxChecked]}
									onPress={() => {toggleItem(item.id)}}
								>
									{item.completed && <Ionicons name="checkmark" size={16} color="#ffffff" />}
								</TouchableOpacity>
								<View style={styles.itemInfo}>
									<Text style={[styles.itemTitle, item.completed && styles.itemTitleCompleted]}>{item.name}</Text>
									<Text style={styles.itemSubtitle}>Quantidade: {item.quantity}</Text>
									{item.completed && (
										<View style={styles.priceRow}>
											<Text style={styles.priceLabel}>Valor por unidade/kg</Text>
											<View style={styles.priceInputRow}>
												<Text style={styles.pricePrefix}>R$</Text>
												<TextInput
													style={styles.priceInput}
													keyboardType="decimal-pad"
													placeholder="0,00"
													value={priceInputs[item.id] ?? ''}
													onChangeText={(texto) => {atualizarPrecoTexto(item.id, texto)}}
													onEndEditing={() => {salvarPreco(item.id)}}
												/>
											</View>
										</View>
									)}
								</View>
							</View>
						))
					)}
				</View>
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
		marginTop: 20,
		marginBottom: 16,
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		flex: 1,
	},
	headerTitle: {
		fontSize: 20,
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
	headerButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#1b7a2b',
		borderRadius: 8,
		paddingVertical: 6,
		paddingHorizontal: 10,
		gap: 6,
		height: 40,
	},
	headerButtonText: {
		fontSize: 12,
		color: '#ffffff',
		fontWeight: 'bold',
	},
	content: {
		paddingBottom: 24,
		gap: 16,
	},
	summaryCard: {
		backgroundColor: '#ffffff',
		borderRadius: 14,
		padding: 16,
		borderWidth: 1,
		borderColor: '#cfcfcf',
	},
	summaryRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	summaryLabel: {
		fontSize: 14,
		color: '#2a2a2a',
		fontWeight: 'bold',
	},
	summaryValue: {
		fontSize: 14,
		color: '#2a2a2a',
		fontWeight: 'bold',
	},
	progressTrack: {
		height: 8,
		backgroundColor: '#d0d0d0',
		borderRadius: 8,
		overflow: 'hidden',
		marginBottom: 12,
	},
	progressFill: {
		height: '100%',
		backgroundColor: '#2b2b2b',
		borderRadius: 8,
	},
	summaryRowBottom: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	totalLabel: {
		fontSize: 14,
		color: '#2a2a2a',
		fontWeight: 'bold',
	},
	totalValue: {
		fontSize: 18,
		color: '#2f7d32',
		fontWeight: 'bold',
	},
	itemsCard: {
		backgroundColor: '#ffffff',
		borderRadius: 14,
		padding: 16,
		borderWidth: 1,
		borderColor: '#cfcfcf',
	},
	itemRow: {
		flexDirection: 'row',
		gap: 12,
		padding: 12,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: '#9c9c9c',
		marginBottom: 12,
	},
	itemRowCompleted: {
		backgroundColor: '#dfffd0',
	},
	itemRowDefault: {
		backgroundColor: '#f0f0f0',
	},
	checkbox: {
		width: 30,
		height: 30,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#8c8c8c',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#e2e2e2',
	},
	checkboxChecked: {
		backgroundColor: '#2f7d32',
		borderColor: '#2f7d32',
	},
	itemInfo: {
		flex: 1,
	},
	itemTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 4,
	},
	itemTitleCompleted: {
		textDecorationLine: 'line-through',
		color: '#4c4c4c',
	},
	itemSubtitle: {
		fontSize: 14,
		color: '#4c4c4c',
		marginBottom: 8,
	},
	priceRow: {
		gap: 6,
	},
	priceLabel: {
		fontSize: 12,
		color: '#2f2f2f',
		fontWeight: 'bold',
	},
	priceInputRow: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#cfcfcf',
		paddingHorizontal: 8,
		paddingVertical: 6,
		gap: 6,
	},
	pricePrefix: {
		fontSize: 14,
		color: '#4c4c4c',
		fontWeight: 'bold',
	},
	priceInput: {
		flex: 1,
		fontSize: 14,
		color: '#1a1a1a',
		fontWeight: 'bold',
		padding: 0,
	},
	emptyText: {
		fontSize: 14,
		color: '#6a6a6a',
		textAlign: 'center',
		fontWeight: 'bold',
	},
});
