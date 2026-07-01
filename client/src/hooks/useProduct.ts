import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { productService } from "../services/product.service";
import { toast } from "react-toastify";
import { productType, variantType } from "../types";

export const useProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState<productType>();
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [editField, setEditField] = useState<'title' | 'basePrice' | 'description'>();
    const [editValue, setEditValue] = useState('');
    const [showAddVariant, setShowAddVariant] = useState(false);
    const [showEditVariant, setShowEditVariant] = useState(false);
    const [showAddImage, setShowAddImage] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<variantType|null>(null);

    const removeCategory = async(categoryId:string)=>{
        if (!product) return
        setSaving(true)
        productService.removeCategory(product._id, categoryId)
        .then(({data})=>{
            if(data.success){
                toast.success(data.message)
                fetchProduct()
                return
            }
            toast.error(data.error)
        }).catch((error)=>toast.error(error.response.data.message))
        .finally(()=>setSaving(false))
    }

    const removeImage = async(imgId:string)=>{
        if (!product) return
        setSaving(true)
        productService.removeImage(product._id, imgId)
        .then(({data})=>{
            if(data.success){
                toast.success(data.message)
                fetchProduct()
                return
            }
            toast.error(data.error)
        }).catch((error)=>toast.error(error.response.data.message))
        .finally(()=>setSaving(false))
    }

    const removeVariant = async(variantId:string)=>{
        if (!product) return
        setSaving(true)
        productService.removeVariant(product._id, variantId)
        .then(({data})=>{
            if(data.success){
                toast.success(data.message)
                fetchProduct()
                return
            }
            toast.error(data.error)
        }).catch((error)=>toast.error(error.response.data.message))
        setSaving(false)
    }

    const activateProduct = async()=>{
        if (!product) return
        setSaving(true)
        productService.activateProduct(product._id)
        .then(({data})=>{
            if(data.success){
                toast.success(data.message)
                fetchProduct()
                return
            }
            toast.error(data.error)
        }).catch((error)=>toast.error(error.response.data.message))
        .finally(()=>setSaving(false))
    }

    const deactivateProduct = async()=>{
        if (!product) return
        setSaving(true)
        productService.deactivateProduct(product._id)
        .then(({data})=>{
            if(data.success){
                toast.success(data.message)
                fetchProduct()
                return
            }
            toast.error(data.error)
        }).catch((error)=>toast.error(error.response.data.message))
        .finally(()=>setSaving(false))
    }

    const setPrimaryImage = async(imgId:string)=>{
        if (!product) return
        setSaving(true)
        productService.setPrimaryImage(product._id, imgId)
        .then(({data})=>{
            if(data.success){
                toast.success(data.message)
                fetchProduct()
                return
            }
            toast.error(data.error)
        }).catch((error)=>toast.error(error.response.data.message))
        .finally(()=>setSaving(false))
    }

    const startEdit = async(field:'title'|'basePrice'|'description')=>{
        if (!product) return
        setEditField(field)
        setEditValue(product[field].toString())
    }

    const cancelEdit = async()=>{
        setEditField(undefined)
        setEditValue('')
        setSaving(false)
    }

    const saveEdit = async(e: React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setSaving(true)

        if (!product) return
        if (!editField) {
            return toast.error('No update field was chosen')
        }
        if (!editValue && editField!=='description') {
            return toast.error('Cannot use empty value for Title nor Base Price')
        }
        
        productService.updateField(product._id, editField, editValue)
        .then(({data})=>{
            if(data.success){
                toast.success(data.message)
                fetchProduct()
                return
            }
            toast.error(data.error)
        }).catch((error)=>toast.error(error.response.data.message))
        .finally(()=>cancelEdit())
    }

    const fetchProduct = async()=>{
        setSelectedImage(0)
        setSaving(false)
        if(!productId) {
            setIsLoading(false)
            setProduct(undefined)
            return 
        }

        productService.getProductById(productId)
        .then(({data})=>{
            setProduct(data.product)
        }).catch(({response: {data}})=>{
            toast.error(data.message)
        }).finally(()=>
            setIsLoading(false)
        )
    }

    useEffect(()=>{
        productId&&fetchProduct()
    },[productId])

    return {
        // State
        product,
        isLoading,
        saving,
        editField,
        editValue,
        showAddVariant,
        showEditVariant,
        selectedVariant,
        selectedImage,
        showAddImage,
        // Setters
        setEditValue,
        setShowAddVariant,
        setShowEditVariant,
        setSelectedVariant,
        setShowAddImage,
        setSelectedImage,
        // Actions
        startEdit,
        cancelEdit,
        saveEdit,
        removeCategory,
        removeVariant,
        removeImage,
        setPrimaryImage,

        activateProduct,
        deactivateProduct,

        refetch: fetchProduct,
    };
}