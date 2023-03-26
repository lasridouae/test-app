import { Client } from "./client";
import { Fournisseur } from "./fournisseur";

export class Cheque {
    id : number;
    client_id? : number;
    fournisseur_id? : number;
    client?: Client;
    fournisseur?:Fournisseur;
    order_id : number;
    date_decaissement? : Date;
    date_encaissement? : Date;
    amount : number ;
    name_bank : string;
    num_cheque : string;
    status : string;
    payment_status : string;
    viewed? : boolean;
    is_deleted? : boolean;
    created_at? : string;
    updated_at? : string
}
