"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, ShoppingCart, DollarSign } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
  createdAt: string
}

interface Props {
  products: Product[]
  onEdit: (product: Product) => void
  onBuy: (product: Product) => void
  onSell: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductListMobile({ products, onEdit, onBuy, onSell, onDelete }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge variant={product.quantity > 10 ? "default" : product.quantity > 0 ? "secondary" : "destructive"}>
                {product.quantity > 10 ? "In Stock" : product.quantity > 0 ? "Low" : "Out"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-semibold">{formatCurrency(product.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-semibold">{product.quantity}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => onBuy(product)} className="gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  Buy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSell(product)}
                  className="gap-1"
                  disabled={product.quantity === 0}
                >
                  <DollarSign className="h-4 w-4" />
                  Sell
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(product)} className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(product)} className="gap-1">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
