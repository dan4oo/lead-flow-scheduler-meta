
export interface ClientCode {
  id: string;
  code: string;
  client_name: string;
  created_at: string;
  status: 'unused' | 'active';
}

export const DEFAULT_ACCESS_CODE = '123456';
