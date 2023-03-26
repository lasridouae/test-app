export class Employer {
    id : number;
    name : string;
    phone : string
    adresse : string;
    cin : string;
    email : string;
    salary : number;
    rest : number;
    payment_status : string;
    is_deleted? : boolean;
    created_at? : string;
    updated_at? : string
}

export class EmployerState {
    // id : number;
    employer_id : string
    date_payment : Date;
    amount : number
    created_at? : string;
    updated_at? : string
}
