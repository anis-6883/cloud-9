import { PAYMENT_METHOD_TYPE, PAYMENT_STATUS } from "@/config/constant";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/utils";
import { CheckoutSchema, Order } from "@/models/Order";
import { Payment } from "@/models/Payment";
import { IProduct, Product } from "@/models/Product";
import z from "zod";

export const POST = asyncHandler(
  CheckoutSchema,
  async (req, data: z.infer<typeof CheckoutSchema>) => {
    const itemsInput = data.items;

    const productIds = itemsInput.map(i => String(i.productId));

    const products = (await Product.find({ _id: { $in: productIds } }).lean()) as IProduct[];

    if (!products || products.length !== productIds.length) {
      return apiResponse(false, 400, "One or more products not found!");
    }

    const productMap = new Map(products.map(p => [String(p._id), p]));

    const computedItems = itemsInput.map(item => {
      const productId = String(item.productId);
      const p = productMap.get(productId);
      if (!p) throw new Error("Product not found!");

      const unitPrice = p.price;
      const unitDiscountPrice = p.hasDiscount ? p.discountPrice : p.price;

      return {
        product: item.productId,
        name: p.name,
        image: p.image,
        quantity: item.quantity,
        finalPrice: p.hasDiscount ? unitDiscountPrice : unitPrice,
        hasDiscount: !!p.hasDiscount,
        discountPctAmount: p.hasDiscount ? p.discountPctAmount : 0
      };
    });

    const totalAmount = computedItems.reduce((sum, it) => sum + it.finalPrice * it.quantity, 0);

    const paymentMethod = PAYMENT_METHOD_TYPE.CASH;

    const order = await Order.create({
      customer: req.userId,
      items: computedItems.map(it => ({
        product: it.product,
        name: it.name,
        image: it.image,
        quantity: it.quantity,
        finalPrice: it.finalPrice,
        hasDiscount: it.hasDiscount,
        discountPctAmount: it.discountPctAmount
      })),
      totalAmount,
      status: "pending"
    });

    await Payment.create({
      order: order._id,
      amount: totalAmount,
      method: paymentMethod,
      status: PAYMENT_STATUS.PENDING,
      paidAt: new Date()
    });

    return apiResponse(true, 201, "Checkout successfully completed!");
  },
  true,
  "Customer"
);
