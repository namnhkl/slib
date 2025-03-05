export interface IUser {
  userName: string
  email: string
  firstName: string
  lastName: any
  phoneNumber: string
  status: string
  userRoles: any[]
  id: string
  createdAt: string
  createdBy: any
  updatedAt: string
  updatedBy: any
  organization: string
}

export interface IUserWithRole {
  id: string;
  userName: string
  email: string
  firstName: string
  lastName: any
  phoneNumber: string
  unitId: string
  roleId: string
  permissionId: string
  userId: string
  organization: string
  jobTitlesId: string
  nameJobTitle: string
  permissionName: string
  unitLabel: string
}

export interface assignmentSearch {
  searchKey?: string;
  pageNumber: number;
  pageSize: number;
}
