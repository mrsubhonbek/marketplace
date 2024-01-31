import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";

import { privateProcedure, router } from "./trpc";
import { getPayloadClient } from "../back/getPayload";
import { stripe } from "../lib/stipe";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      let { productIds } = input;

      if (productIds.length === 0) throw new TRPCError({ code: "BAD_REQUEST" });

      const payload = await getPayloadClient();
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: {
              productIds,
            },
          },
        },
      });

      const filteredProducts = products.filter((prod) => Boolean(prod.priceId));

      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts,
          user: user.id,
        },
      });
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      line_items.push({
        price: "price_1OefMyAM8HlewFZuzcJpfYld",
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      });

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card", "paypal"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });
      } catch (error) {}
    }),
});
