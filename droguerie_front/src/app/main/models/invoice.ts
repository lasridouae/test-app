import { Order } from "./order";

export class Invoice {
    id : number;
    order_id : number;
    transaction_date : string;
    due_date? : string;
    notes? : string;
    type_invoice : string;
    in_out : string;
    type_transaction? : string;
    order? : Order[];
    is_deleted? : boolean;
    viewed? : boolean;
    created_at? : string;
    updated_at? : string
}











[
    {
        "id": 2,
        "client_id": 2,
        "fournisseur_id": null,
        "order_id": 7,
        "date_payment": null,
        "amount": 241,
        "approaching_date": "2023-01-30 23:00:00",
        "viewed": 0,
        "payment_status": "unpaid",
        "is_deleted": 0,
        "created_at": "2023-01-31T09:38:06.000000Z",
        "updated_at": "2023-01-31T09:38:06.000000Z",
        "client": {
            "id": 2,
            "cin": null,
            "name": "adaouy",
            "email": "ham@gmail.com",
            "adresse": "rabt morroco",
            "phone": "654607383",
            "is_deleted": 0,
            "created_at": "2023-01-31T07:59:50.000000Z",
            "updated_at": "2023-01-31T07:59:50.000000Z"
        },
        "fournisseur": null,
        "order": {
            "id": 7,
            "client_id": 2,
            "fournisseur_id": null,
            "payment_type": "credit",
            "payment_status": "unpaid",
            "grand_total": 241,
            "discount": 0,
            "tax": 0,
            "date": "2023-01-31 09:04:22",
            "viewed": 0,
            "type_order": "invoice",
            "is_deleted": 0,
            "created_at": "2023-01-31T09:04:23.000000Z",
            "updated_at": "2023-01-31T09:38:06.000000Z"
        }
    }
]