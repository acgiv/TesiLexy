export interface Login {
   "status_code": number,
    "response": ResponseLogin,
    "error":
        {
            "number_error": number,
            "message": []
        },
    "completed": boolean


}

export interface ResponseLogin{
  result_connection: boolean;
  id_utente: string;
  username: string;
  email: string;
  eta?: number;
  ruolo: string;
  valuta?:string;
  conta_testi_Associati?: string;
}
