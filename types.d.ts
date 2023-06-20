import { DefaultUser } from "next-auth";

declare module "next-auth" {
	interface Session {
		user?: DefaultUser & {
			id: string;
			stripeCustomerId: string;
			isActive: boolean;
		};
	}
	interface User extends DefaultUser {
		stripeCustomerId: string;
		isActive: boolean;
	}
}

export interface TCustomer {
	id: string;
	object: string;
	address: null;
	balance: number;
	created: number;
	currency: string;
	default_source: string;
	delinquent: boolean;
	description: string;
	discount: null;
	email: string;
	invoice_prefix: string;
	invoice_settings: InvoiceSettings;
	livemode: boolean;
	metadata: Metadata;
	name: null;
	next_invoice_sequence: number;
	phone: null;
	preferred_locales: any[];
	shipping: null;
	tax_exempt: string;
	test_clock: null;
	isActive: boolean;
}

export interface InvoiceSettings {
	custom_fields: null;
	default_payment_method: null;
	footer: null;
	rendering_options: null;
}

export interface Metadata {
	order_id: string;
}
