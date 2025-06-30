
// import { Product, Shop, Rental } from "@/types";

// export const mockShops: Shop[] = [
//   {
//     id: "shop1",
//     name: "Urban Chic",
//     description: "Contemporary fashion for the modern urbanite",
//     logoUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
//     featured: true,
//   },
//   {
//     id: "shop2",
//     name: "Vintage Vogue",
//     description: "Timeless classics from every decade",
//     logoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
//     featured: true,
//   },
//   {
//     id: "shop3",
//     name: "Sustainable Styles",
//     description: "Eco-friendly fashion for the conscious consumer",
//     logoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
//     featured: false,
//   },
//   {
//     id: "shop4",
//     name: "Designer Depot",
//     description: "Luxury fashion at affordable rental prices",
//     logoUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
//     featured: true,
//   },
// ];

// export const mockProducts: Product[] = [
//   // Urban Chic products
//   {
//     id: "product1",
//     name: "Classic Black Blazer",
//     description: "A timeless black blazer that goes with everything",
//     rentalPrice: 25,
//     imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
//     shopId: "shop1",
//     category: "Outerwear",
//     size: "M",
//     available: true,
//   },
//   {
//     id: "product2",
//     name: "Tailored White Shirt",
//     description: "Crisp white shirt for a professional look",
//     rentalPrice: 15,
//     imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
//     shopId: "shop1",
//     category: "Tops",
//     size: "S",
//     available: true,
//   },
//   {
//     id: "product3",
//     name: "Slim Fit Jeans",
//     description: "Modern slim fit jeans in dark wash",
//     rentalPrice: 18,
//     imageUrl: "https://images.unsplash.com/photo-1604176354204-9268737828e4",
//     shopId: "shop1",
//     category: "Bottoms",
//     size: "M",
//     available: true,
//   },
  
//   // Vintage Vogue products
//   {
//     id: "product4",
//     name: "70s Flared Jumpsuit",
//     description: "Retro-inspired jumpsuit with flared legs",
//     rentalPrice: 30,
//     imageUrl: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed",
//     shopId: "shop2",
//     category: "Dresses",
//     size: "L",
//     available: true,
//   },
//   {
//     id: "product5",
//     name: "50s Polka Dot Dress",
//     description: "Swing dress with classic polka dot pattern",
//     rentalPrice: 35,
//     imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
//     shopId: "shop2",
//     category: "Dresses",
//     size: "XS",
//     available: true,
//   },
//   {
//     id: "product6",
//     name: "Retro Leather Jacket",
//     description: "Vintage-inspired leather jacket",
//     rentalPrice: 45,
//     imageUrl: "https://images.unsplash.com/photo-1551794840-8ae3b9c551c6",
//     shopId: "shop2",
//     category: "Outerwear",
//     size: "M",
//     available: true,
//   },
  
//   // Sustainable Styles products
//   {
//     id: "product7",
//     name: "Organic Cotton Sweater",
//     description: "Eco-friendly sweater made from organic materials",
//     rentalPrice: 22,
//     imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
//     shopId: "shop3",
//     category: "Tops",
//     size: "L",
//     available: true,
//   },
//   {
//     id: "product8",
//     name: "Recycled Denim Skirt",
//     description: "Upcycled denim converted into a stylish skirt",
//     rentalPrice: 20,
//     imageUrl: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f",
//     shopId: "shop3",
//     category: "Bottoms",
//     size: "M",
//     available: true,
//   },
  
//   // Designer Depot products
//   {
//     id: "product9",
//     name: "Designer Evening Gown",
//     description: "Elegant gown for special occasions",
//     rentalPrice: 85,
//     imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae",
//     shopId: "shop4",
//     category: "Dresses",
//     size: "S",
//     available: true,
//   },
//   {
//     id: "product10",
//     name: "Luxury Handbag",
//     description: "High-end designer handbag",
//     rentalPrice: 50,
//     imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
//     shopId: "shop4",
//     category: "Accessories",
//     size: "One Size",
//     available: true,
//   },
//   {
//     id: "product11",
//     name: "Designer Suit",
//     description: "Premium tailored suit for formal events",
//     rentalPrice: 95,
//     imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22",
//     shopId: "shop4",
//     category: "Outerwear",
//     size: "L",
//     available: true,
//   },
// ];

// export const mockRentals: Rental[] = [
//   {
//     id: "rental1",
//     productId: "product1",
//     product: mockProducts.find(p => p.id === "product1") as Product,
//     startDate: "2023-04-15",
//     endDate: "2023-04-18",
//     totalPrice: 75,
//     status: "completed",
//   },
//   {
//     id: "rental2",
//     productId: "product4",
//     product: mockProducts.find(p => p.id === "product4") as Product,
//     startDate: "2023-04-20",
//     endDate: "2023-04-25",
//     totalPrice: 150,
//     status: "active",
//   },
// ];

// // Helper functions to work with mock data
// export const getProductById = (id: string): Product | undefined => {
//   return mockProducts.find(product => product.id === id);
// };

// export const getProductsByShop = (shopId: string): Product[] => {
//   return mockProducts.filter(product => product.shopId === shopId);
// };

// export const getShopById = (id: string): Shop | undefined => {
//   return mockShops.find(shop => shop.id === id);
// };

// export const getFeaturedShops = (): Shop[] => {
//   return mockShops.filter(shop => shop.featured);
// };

// export const getProductsByCategory = (category: string): Product[] => {
//   return mockProducts.filter(product => product.category === category);
// };
const category = [
  "Outerwear",
  "Tops",
  "Bottoms",
  "Dresses",
  "Accessories"
]
export const getAllCategories = (): string[] => {
  return category;
};
