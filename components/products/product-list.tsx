"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Package, Search } from "lucide-react";
import { CreateProductModal } from "./create-product-modal";
import { EditProductModal } from "./edit-product-modal";
import { BuyProductModal } from "./buy-product-modal";
import { SellProductModal } from "./sell-product-modal";
import { DeleteProductDialog } from "./delete-product-dialog";
import { ProductListTable } from "./product-list-table";
import { ProductListMobile } from "./product-list-mobile";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { ModeToggle } from "../theme-component";

const searchSchema = z.object({
  search: z.string().trim(),
});

type SearchForm = z.infer<typeof searchSchema>;

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt?: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export function ProductList() {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [buyProduct, setBuyProduct] = useState<Product | null>(null);
  const [sellProduct, setSellProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const isMobile = useIsMobile();

  const { register, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: "" },
  });

  const searchTerm = watch("search");

  const { data, error, mutate } = useSWR(
    `/api/products?page=${page}&limit=10`,
    fetcher,
    { refreshInterval: 0 }
  );

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    if (!searchTerm) return data.products;

    const term = searchTerm.toLowerCase();
    return data.products.filter(
      (product: Product) =>
        product.name.toLowerCase().includes(term) ||
        product.id.toLowerCase().includes(term) ||
        product.price.toString().includes(term)
    );
  }, [data?.products, searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
    }
  }, [searchTerm]);

  const handleSuccess = (message: string) => {
    toast.success("success", { description: message });
    mutate();
  };

  const handleError = (message: string) => {
    toast.error("error", { description: message });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">
                Product Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your inventory with ease
              </p>
            </div>

            <ModeToggle />
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="lg"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              {...register("search")}
              type="text"
              placeholder="Search products by name, ID, or price..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>

        {error && (
          <Card className="p-6 mb-6 bg-destructive/10 border-destructive">
            <p className="text-destructive">
              Failed to load products. Please try again.
            </p>
          </Card>
        )}

        {!data && !error && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-r-transparent" />
              <span className="text-muted-foreground">Loading products...</span>
            </div>
          </div>
        )}

        {data && filteredProducts.length === 0 && searchTerm && (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search term
            </p>
          </Card>
        )}

        {data && data.products.length === 0 && !searchTerm && (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first product
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          </Card>
        )}

        {data && filteredProducts.length > 0 && (
          <>
            {isMobile ? (
              <ProductListMobile
                products={filteredProducts}
                onEdit={setEditProduct}
                onBuy={setBuyProduct}
                onSell={setSellProduct}
                onDelete={setDeleteProduct}
              />
            ) : (
              <ProductListTable
                products={filteredProducts}
                onEdit={setEditProduct}
                onBuy={setBuyProduct}
                onSell={setSellProduct}
                onDelete={setDeleteProduct}
              />
            )}

            {!searchTerm && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: data.pagination.totalPages },
                    (_, i) => i + 1
                  ).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      onClick={() => setPage(p)}
                      size="sm"
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                  }
                  disabled={page === data.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateProductModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      {editProduct && (
        <EditProductModal
          open={!!editProduct}
          onOpenChange={(open) => !open && setEditProduct(null)}
          product={editProduct}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {buyProduct && (
        <BuyProductModal
          open={!!buyProduct}
          onOpenChange={(open) => !open && setBuyProduct(null)}
          product={buyProduct}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {sellProduct && (
        <SellProductModal
          open={!!sellProduct}
          onOpenChange={(open) => !open && setSellProduct(null)}
          product={sellProduct}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {deleteProduct && (
        <DeleteProductDialog
          open={!!deleteProduct}
          onOpenChange={(open) => !open && setDeleteProduct(null)}
          product={deleteProduct}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </div>
  );
}
