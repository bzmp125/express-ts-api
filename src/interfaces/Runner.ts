export interface Runner {
  _id: string;
  id?: string;
  name: string;
  email: string;
  last_edited_by: string;
  created_by: string;
}

export interface RunnerChanges {
  name: string;
  password: string;
  last_edited_by: string;
}
