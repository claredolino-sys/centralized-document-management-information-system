export enum UserRole {
  ADMIN = 'Admin',
  CUSTODIAN = 'Departmental Record Custodian',
  STAFF = 'Staff',
}

export interface User {
  id: number;
  school_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  department_id: number | null;
  department_name?: string;
  profile_picture_url: string | null;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  school_id: string;
  password: string;
}

export interface Record {
  id: number;
  record_series_title_description: string;
  period_covered: string | null;
  volume: string | null;
  record_medium: string | null;
  restrictions: string | null;
  location: string | null;
  frequency_of_use: string | null;
  duplication: string | null;
  time_value: 'T' | 'P' | null;
  utility_value: string | null;
  retention_period_active: string | null;
  retention_period_storage: string | null;
  retention_period_total: string | null;
  disposition_provision: string | null;
  date_of_record: string | null;
  calculated_disposal_date: string | null;
  department_id: number;
  department_name?: string;
  created_by_user_id: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface RecordFile {
  id: number;
  record_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size_bytes: number;
  uploaded_by_user_id: number;
  uploaded_by_name?: string;
  uploaded_at: string;
}

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface DocumentRequest {
  id: number;
  record_id: number;
  record_series_title_description?: string;
  requester_user_id: number;
  requester_name?: string;
  purpose: string;
  requester_id_image_path: string;
  status: RequestStatus;
  approver_user_id: number | null;
  approver_name?: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalRecords: number;
  recordsByDepartment: Array<{ name: string; count: number }>;
  recordsByMedium: Array<{ record_medium: string; count: number }>;
  pendingRequests: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: number;
  user_id: number;
  full_name?: string;
  office: string;
  operation: string;
  action_date_time: string;
  record_series_title_description: string | null;
  details: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
