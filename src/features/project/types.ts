export type ProjectNode = {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};
