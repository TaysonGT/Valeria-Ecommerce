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
  removeImage: (productId: string, imgId: string) =>
    axios.delete(`/products/${productId}/images/${imgId}`),
  setPrimaryImage: (productId: string, imageId: string) =>
    axios.put(`/products/${productId}/images/${imageId}/set-primary`),
  uploadImages: (productId: string, formData:{imgsInfo: {secure_url: string,public_id:string}[]} )=> 
    axios.post(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
}