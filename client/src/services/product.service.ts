import axios from "axios";

export const productService = {
  getProductById: (id: string) => 
    axios.get(`/products/${id}`),
  updateField: (id: string, field: string, value: any) => 
    axios.patch(`/products/${id}`, { [field]: value }),
  removeCategory: (productId: string, categoryId: string) =>
    axios.delete(`/products/${productId}/categories/${categoryId}`),
  removeVariant: (productId: string, variantId: string) =>
    axios.delete(`/products/${productId}/variants/${variantId}`),
  setPrimaryImage: (productId: string, imageId: string) =>
    axios.put(`/products/${productId}/images/${imageId}/set-primary`),
  uploadImages: (productId: string, formData:FormData )=> 
    axios.post(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
}