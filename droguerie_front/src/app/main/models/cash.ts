import { Client } from './client';
import { Fournisseur } from './fournisseur';
export class Cash {
    id : number;
    client_id? : number;
    fournisseur_id? : number;
    client?: Client;
    fournisseur?:Fournisseur;
    order_id : number;
    date_payment : Date;
    amount : number ;
    payment_status? : string;
    viewed? : boolean;
    is_deleted? : boolean;
    created_at? : string;
    updated_at? : string
}
