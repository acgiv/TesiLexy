export interface Register {
  status_code: number;
  error?: {
    number_error: number | undefined;
    message?: {
      [key: string]: string;
    }[];
  };
  completed: boolean;
}

export interface RegisterBody{
  username: string;
  email: string;
  password: string;
}



