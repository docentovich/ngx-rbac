export enum Status {
  authorized = 'Authorized',
  deleted = 'Deleted',
}

export interface User {
  id: string;
  name: string;
  status: Status;
}
