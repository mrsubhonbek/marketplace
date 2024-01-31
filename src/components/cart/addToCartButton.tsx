"use client";
import { useEffect, useState } from "react";

import { Product } from "@/back/payload-types";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/use-cart";

export const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isSuccess]);

  return (
    <Button
      onClick={() => {
        addItem(product);
        setIsSuccess(true);
      }}
      size="lg"
      className="w-full">
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  );
};
