import Stripe from "stripe";
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51Oef64AM8HlewFZunZoIYbN1yMaF2giuDjGiqeKNbf1jao8W1mF7h8oOteoyBLrybfraKWklIVLfdE0H6UKDPbmw00XYnzNgIg",
  {
    apiVersion: "2023-10-16",
    typescript: true,
  }
);
