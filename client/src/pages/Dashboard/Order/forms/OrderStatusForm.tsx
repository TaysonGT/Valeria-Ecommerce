// components/OrderStatusForm.tsx
import React, { useState } from 'react';
import { statusTransitions } from '../../../../types/order-status.config';
import { Button } from '../../../../components/ui/Button';


interface OrderStatusFormProps {
  currentStatus: string;
  targetStatus: string;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  isLoading: boolean
}

export const OrderStatusForm: React.FC<OrderStatusFormProps> = ({
  currentStatus,
  targetStatus,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const transitionKey = `${currentStatus}->${targetStatus}`;
  const config = statusTransitions[transitionKey];
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [deliveryType, setDeliveryType] = useState<string>('');
  
  if (!config) {
    return <div>Invalid transition</div>;
  }
  
  const shouldShowField = (field: any) => {
    if (!field.dependsOn) return true;
    return formData[field.dependsOn.field] === field.dependsOn.value;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {config.fields.map((field) => {
        if (!shouldShowField(field)) return null;
        
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                className="w-full border rounded-md p-2"
                rows={3}
                required={field.required}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              />
            ) : field.type === 'select' ? (
              <select
                className="w-full border rounded-md p-2"
                required={field.required}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, [field.name]: value });
                  if (field.name === 'deliveryType') setDeliveryType(value);
                }}
              >
                <option value="">Select...</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : field.type === 'date' ? (
              <input
                type="date"
                className="w-full border rounded-md p-2"
                required={field.required}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              />
            ) : (
              <input
                type={field.type}
                className="w-full border rounded-md p-2"
                required={field.required}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              />
            )}
          </div>
        );
      })}
      <div className='flex justify-end gap-2 pt-4'>
        <Button onClick={onCancel} className='cursor-pointer' disabled={isLoading} variant='outline'>Cancel</Button>
        <Button type='submit' className='cursor-pointer flex items-center gap-4' disabled={isLoading} variant='primary'>
            {config.buttonText}
        </Button>
      </div>
    </form>
  );
};