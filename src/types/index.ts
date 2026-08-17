export interface Tea {
  id: string;
  name: string;
  category: string;
  origin: string;
  price: number;
  stock: number;
  steepTime: string;
  steepTemp: string;
  liquorColor: string;
  description: string;
}

export interface CartItem {
  teaId: string;
  quantity: number;
}
