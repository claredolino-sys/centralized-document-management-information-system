export enum UserRole {
  ADMIN = 'Admin',
  CUSTODIAN = 'Departmental Record Custodian',
  STAFF = 'Staff',
}

export interface User {
  id: number;
  school_id: string;
  password_hash: string;
  full_name: string;
  email: string;
  role: UserRole;
  department_id: number | null;
  profile_picture_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Department {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
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
  date_of_record: Date | null;
  calculated_disposal_date: Date | null;
  department_id: number;
  created_by_user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface RecordFile {
  id: number;
  record_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size_bytes: number;
  uploaded_by_user_id: number;
  uploaded_at: Date;
}

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface DocumentRequest {
  id: number;
  record_id: number;
  requester_user_id: number;
  purpose: string;
  requester_id_image_path: string;
  status: RequestStatus;
  approver_user_id: number | null;
  remarks: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ActivityLog {
  id: number;
  user_id: number;
  office: string;
  operation: string;
  action_date_time: Date;
  record_series_title_description: string | null;
  details: string | null;
}

export interface DispositionSchedule {
  item_number: string;
  record_series_title: string;
  description: string | null;
  authorized_retention_period: string;
}

export interface JWTPayload {
  userId: number;
  schoolId: string;
  role: UserRole;
  departmentId: number | null;
}
