import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Product, Store, Rental } from "@/lib/types";
import axiosInstance from "@/lib/axiosInstance";
// import ApiConstants from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/contexts/AuthContext";
import { toast } from "sonner";

const MyStore = () => {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    rentalPrice: "",
    category: "",
    size: "",
    images: [] as string[],
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [showEditProduct, setShowEditProduct] = useState(false);

  // Fetch store and products data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?._id) return;
        console.log("user", user);
        // Fetch store info
        const storeResponse = await axiosInstance.get(`/stores/${user._id}`);
        const storeData = {
          _id: storeResponse.data._id,
          ...storeResponse.data.storeInfo,
        };
        console.log("storeData", storeData);
        setStore(storeData);

        // Fetch store products
        const productsResponse = await axiosInstance.get(
          `/products/store/${storeData._id}`
        );
        setProducts(productsResponse.data);

        // Fetch store rentals
        console.log("Store ID", storeData._id);
        const rentalsResponse = await axiosInstance.get(
          `/rentals/store/${storeData._id}`
        );
        const allRentals = rentalsResponse.data;
        console.log("All Rentals", allRentals);
        // Filter rentals for this store
        const storeRentals = allRentals.filter(
          (rental: Rental) => rental.storeId === storeData._id
        );
        setRentals(storeRentals);
      } catch (error) {
        console.error("Error fetching store data:", error);
        toast.error("Failed to load store data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  // Handle new product submission
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedImage) {
        toast.error("Please select an image");
        return;
      }

      // Prepare form data for multipart upload
      const formData = new FormData();
      formData.append("product", selectedImage); // file field must be 'product'
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("rentalPrice", newProduct.rentalPrice);
      formData.append("category", newProduct.category);
      formData.append("size", newProduct.size);

      const response = await axiosInstance.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // The backend returns { message, product }
      setProducts([...products, response.data.product]);
      setShowAddProduct(false);
      setNewProduct({
        name: "",
        description: "",
        rentalPrice: "",
        category: "",
        size: "",
        images: [],
      });
      setSelectedImage(null);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  // Calculate store statistics
  const totalProducts = products.length;
  const totalRentals = rentals.length;
  const totalRevenue = rentals.reduce(
    (sum, rental) => sum + rental.totalPrice,
    0
  );
  const completedRentals = rentals.filter(
    (r) => r.status === "RETURNED"
  ).length;

  // Handle delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axiosInstance.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Handle open edit form
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditImage(null);
    setShowEditProduct(true);
  };

  // Handle update product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      let updateData: any = {
        name: editingProduct.name,
        description: editingProduct.description,
        rentalPrice: editingProduct.rentalPrice,
        category: editingProduct.category,
        size: editingProduct.size,
        available: editingProduct.available,
      };
      let config = {};
      if (editImage) {
        const formData = new FormData();
        Object.entries(updateData).forEach(([k, v]) =>
          formData.append(k, v as string)
        );
        formData.append("product", editImage);
        updateData = formData;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      }
      const res = await axiosInstance.put(
        `/products/${editingProduct._id}`,
        updateData,
        config
      );
      setProducts(
        products.map((p) => (p._id === editingProduct._id ? res.data : p))
      );
      setEditingProduct(null);
      setEditImage(null);
      setShowEditProduct(false);
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!store) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-4">You don't have a store yet.</p>
          <Button onClick={() => (window.location.href = "/create-store")}>
            Create Store
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Store Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={store.logoUrl}
              alt={store.storeName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{store.storeName}</h1>
              <p className="text-gray-600">{store.description}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Total Rentals</h3>
            <p className="text-3xl font-bold text-green-600">{totalRentals}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Completed Rentals</h3>
            <p className="text-3xl font-bold text-purple-600">
              {completedRentals}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-orange-600">
              {totalRevenue.toLocaleString()} VNĐ
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Products</h2>
            <Button onClick={() => setShowAddProduct(true)}>
              Add New Product
            </Button>
          </div>

          {/* Add Product Form */}
          {showAddProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Add New Product</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAddProduct(false)}
                    className="hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Product Name
                      </Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        placeholder="Enter product name"
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="rentalPrice"
                        className="text-sm font-medium"
                      >
                        Rental Price (VNĐ/day)
                      </Label>
                      <Input
                        id="rentalPrice"
                        type="number"
                        value={newProduct.rentalPrice}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            rentalPrice: e.target.value,
                          })
                        }
                        placeholder="Enter rental price"
                        className="w-full"
                        min="0"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category
                      </Label>
                      <select
                        id="category"
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            category: e.target.value,
                          })
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="DRESS">Dress</option>
                        <option value="SUIT">Suit</option>
                        <option value="ACCESSORY">Accessory</option>
                        <option value="SHOES">Shoes</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size" className="text-sm font-medium">
                        Size
                      </Label>
                      <select
                        id="size"
                        value={newProduct.size}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, size: e.target.value })
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      >
                        <option value="">Select a size</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter product description"
                        className="w-full min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="image" className="text-sm font-medium">
                        Product Image
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {selectedImage ? (
                          <div className="space-y-4">
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt="Preview"
                              className="mx-auto max-h-48 rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setSelectedImage(null)}
                              className="mt-2"
                            >
                              Change Image
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex flex-col items-center justify-center">
                              <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="mt-2 text-sm text-gray-600">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setSelectedImage(
                                  e.target.files ? e.target.files[0] : null
                                )
                              }
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                document.getElementById("image")?.click()
                              }
                            >
                              Select Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddProduct(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Add Product
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg overflow-hidden relative"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">
                      {product.rentalPrice.toLocaleString()} VNĐ/day
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        product.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.available ? "Available" : "Rented"}
                    </span>
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="ghost"
                      className="text-fashion-DEFAULT hover:cursor-pointer  bg-blue-500 hover:bg-blue-600"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-fashion-DEFAULT hover:cursor-pointer bg-red-500 hover:bg-red-600"
                      size="sm"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Product Form */}
        {showEditProduct && editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Product</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowEditProduct(false);
                    setEditingProduct(null);
                    setEditImage(null);
                  }}
                  className="hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>
              <form onSubmit={handleUpdateProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-sm font-medium">
                      Product Name
                    </Label>
                    <Input
                      id="edit-name"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter product name"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-rentalPrice"
                      className="text-sm font-medium"
                    >
                      Rental Price (VNĐ/day)
                    </Label>
                    <Input
                      id="edit-rentalPrice"
                      type="number"
                      value={editingProduct.rentalPrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          rentalPrice: Number(e.target.value),
                        })
                      }
                      placeholder="Enter rental price"
                      className="w-full"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-category"
                      className="text-sm font-medium"
                    >
                      Category
                    </Label>
                    <select
                      id="edit-category"
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="DRESS">Dress</option>
                      <option value="SUIT">Suit</option>
                      <option value="ACCESSORY">Accessory</option>
                      <option value="SHOES">Shoes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-size" className="text-sm font-medium">
                      Size
                    </Label>
                    <select
                      id="edit-size"
                      value={editingProduct.size}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          size: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Select a size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor="edit-description"
                      className="text-sm font-medium"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="edit-description"
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter product description"
                      className="w-full min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="edit-image" className="text-sm font-medium">
                      Product Image
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {editImage ? (
                        <div className="space-y-4">
                          <img
                            src={URL.createObjectURL(editImage)}
                            alt="Preview"
                            className="mx-auto max-h-48 rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditImage(null)}
                            className="mt-2"
                          >
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {editingProduct.images &&
                            editingProduct.images[0] && (
                              <img
                                src={editingProduct.images[0]}
                                alt="Current"
                                className="mx-auto max-h-48 rounded-lg"
                              />
                            )}
                          <Input
                            id="edit-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setEditImage(
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("edit-image")?.click()
                            }
                          >
                            Select New Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditProduct(false);
                      setEditingProduct(null);
                      setEditImage(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Update Product
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Recent Rentals Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Recent Rentals</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Dates</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {rentals.slice(0, 5).map((rental) => (
                  <tr key={rental._id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {rental.productId &&
                        rental.productId.images &&
                        rental.productId.images[0] ? (
                          <img
                            src={rental.productId.images[0]}
                            alt={rental.productId.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            No Image
                          </div>
                        )}
                        <span>{rental.productId?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{rental.customerId.username}</td>
                    <td className="py-3 px-4">
                      {new Date(rental.rentalStart).toLocaleDateString()} -{" "}
                      {new Date(rental.rentalEnd).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {rental.totalPrice.toLocaleString()} VNĐ
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          rental.status === "RETURNED"
                            ? "bg-green-100 text-green-800"
                            : rental.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyStore;
