'use client';

import { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { CheckoutFormData } from '@/lib/utils/validation';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';

interface CheckoutFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  watch: UseFormWatch<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
}

export default function CheckoutForm({ register, errors, watch, setValue }: CheckoutFormProps) {
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const shippingAddress = watch('shipping_address');

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <Input
            label="Full Name"
            {...register('customer_name')}
            error={errors.customer_name?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register('customer_email')}
            error={errors.customer_email?.message}
          />
          <Input
            label="Phone (Optional)"
            type="tel"
            {...register('customer_phone')}
            error={errors.customer_phone?.message}
          />
        </div>
      </Card>

      {/* Shipping Address */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="space-y-4">
          <Input
            label="Address Line 1"
            {...register('shipping_address.address_line_1')}
            error={errors.shipping_address?.address_line_1?.message}
          />
          <Input
            label="Address Line 2 (Optional)"
            {...register('shipping_address.address_line_2')}
            error={errors.shipping_address?.address_line_2?.message}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              {...register('shipping_address.city')}
              error={errors.shipping_address?.city?.message}
            />
            <Input
              label="State/Province (Optional)"
              {...register('shipping_address.state')}
              error={errors.shipping_address?.state?.message}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Postal Code"
              {...register('shipping_address.postal_code')}
              error={errors.shipping_address?.postal_code?.message}
            />
            <Input
              label="Country"
              {...register('shipping_address.country')}
              error={errors.shipping_address?.country?.message}
            />
          </div>
        </div>
      </Card>

      {/* Billing Address */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Billing Address</h2>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => {
                setSameAsShipping(e.target.checked);
                if (e.target.checked && shippingAddress) {
                  setValue('billing_address', undefined);
                } else if (!e.target.checked) {
                  setValue('billing_address', {
                    address_line_1: '',
                    city: '',
                    postal_code: '',
                    country: '',
                  });
                }
              }}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">Same as shipping address</span>
          </label>
        </div>
        {!sameAsShipping && (
          <div className="space-y-4">
            <Input
              label="Address Line 1"
              {...register('billing_address.address_line_1')}
              error={errors.billing_address?.address_line_1?.message}
            />
            <Input
              label="Address Line 2 (Optional)"
              {...register('billing_address.address_line_2')}
              error={errors.billing_address?.address_line_2?.message}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                {...register('billing_address.city')}
                error={errors.billing_address?.city?.message}
              />
              <Input
                label="State/Province (Optional)"
                {...register('billing_address.state')}
                error={errors.billing_address?.state?.message}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                {...register('billing_address.postal_code')}
                error={errors.billing_address?.postal_code?.message}
              />
              <Input
                label="Country"
                {...register('billing_address.country')}
                error={errors.billing_address?.country?.message}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

