import AsyncStorage from '@react-native-async-storage/async-storage';   

export type Lista = {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  itens: Item[];
};

const LISTAS_KEY = "listas";

export type Item = {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  completed: boolean;
};

const ITENS_KEY = "itens";

export async function salvarLista(id: string, title: string, itens: Item[], date: string): Promise<Lista> {
  try {
    const listas = await carregarListas();
    const novaLista: Lista = {
      id: Date.now().toString(),
      title: title,
      completed: false,
      date: new Date().toISOString(),
      itens: [],
    };
    listas.push(novaLista);
    await AsyncStorage.setItem(LISTAS_KEY, JSON.stringify(listas));
    return novaLista;
  } catch (error) {
    console.error("Erro ao salvar a lista:", error);
    throw error;
  }
}

export async function carregarListas(): Promise<Lista[]> {
  try {
    const textoSalvo = await AsyncStorage.getItem(LISTAS_KEY);
    if (textoSalvo !== null) {
      return JSON.parse(textoSalvo) as Lista[];
    }
    return [];
  } catch (error) {
    console.error("Erro ao carregar as listas:", error);
    return [];
  }
}

export async function DeletarLista(id: string): Promise<void> {
  try {
    const listas = await carregarListas();
    const novasListas = listas.filter(lista => lista.id !== id);
    await AsyncStorage.setItem(LISTAS_KEY, JSON.stringify(novasListas));
  } catch (error) {
    console.error("Erro ao deletar a lista:", error);
  }
}