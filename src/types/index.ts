export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export type HOStatus = 'CURED' | 'FLOW' | 'RB' | 'STAB' | 'ECS';

export interface CommentResponse {
  id: string;
  comment: string;
  commentedById: string;
  commentedByName: string;
  createdAt: string;
}

export interface CollectionCase {
  id: string;
  srNo: number;
  apac: string;
  partyName: string;
  customerContactNo: string;
  fos: string;
  fosContactNo: string;
  hoStatus: HOStatus;
  bkt: string;
  emi: number;
  pos: number;
  caseValue: number;
  lmFri: number;
  curFri: number;
  odWithoutFri: number;
  odWithFri: number;
  address: string;
  assetName: string;
  registrationNumber: string;
  engineNo: string;
  chassisNo: string;
  assignedUser?: User;
  comments?: CommentResponse[];
  createdAt: string;
  updatedAt: string;
  mcollectId: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ImportResult {
  totalRows: number;
  successCount: number;
  failedCount: number;
  errors: string[];
}

export interface FilterState {
  status: HOStatus | 'ALL';
  search: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
