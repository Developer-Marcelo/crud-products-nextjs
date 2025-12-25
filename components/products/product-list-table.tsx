"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit, Trash2, ShoppingCart, DollarSign } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export function ProductListTable({ products, onEdit, onBuy, onSell, onDelete }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <Badge variant={product.quantity > 10 ? "default" : product.quantity > 0 ? "secondary" : "destructive"}>
                  {product.quantity > 10 ? "In Stock" : product.quantity > 0 ? "Low Stock" : "Out of Stock"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
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
                  <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(product)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
