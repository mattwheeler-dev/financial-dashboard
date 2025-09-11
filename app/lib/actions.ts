"use server";

import { z } from "zod";
import { CreateInvoice } from "../ui/invoices/buttons";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
	id: z.string(),
	customerId: z.string(),
	amount: z.coerce.number(),
	status: z.enum(["pending", "paid"]),
	date: z.string(),
});

export const createInvoice = async (formData: FormData) => {
	const { customerId, amount, status } = CreateInvoice.parse({
		customerId: formData.get("customerId"),
		amount: formData.get("amount"),
		status: formData.get("status"),
	});
	const amountInCents = amount * 100;
	const date = new Date().toISOString().split("T")[0];

	await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
};
