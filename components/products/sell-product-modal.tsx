"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const sellSchema = z.object({
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

type SellFormData = z.infer<typeof sellSchema>;

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function SellProductModal({
  open,
  onOpenChange,
  product,
  onSuccess,
  onError,
}: Props) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SellFormData>({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const quantity = watch("quantity");
  const total = quantity ? product.price * quantity : 0;

  const onSubmit = async (data: SellFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/products/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          quantity: data.quantity,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to sell product");
      }

      const result = await res.json();
      onSuccess(
        `Successfully sold ${data.quantity} units. New balance: ${result.balance}`
      );
      reset();
      onOpenChange(false);
    } catch (error) {
      onError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-112.5">
        <DialogHeader>
          <DialogTitle>Sell Product</DialogTitle>
          <DialogDescription>
            Remove stock from {product.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Stock:</span>
                <span className="font-semibold">{product.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unit Price:</span>
                <span className="font-semibold">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity to Sell</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={product.quantity}
                placeholder="1"
                {...register("quantity", { valueAsNumber: true })}
                disabled={loading}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum available: {product.quantity}
              </p>
            </div>
            <div className="rounded-lg bg-secondary/20 p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Revenue:</span>
                <span className="text-2xl font-bold text-secondary">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Sale
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
