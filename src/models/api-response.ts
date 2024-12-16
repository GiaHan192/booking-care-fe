import { IDoctor } from './doctor'
import { IPostItem } from './post'

export interface responseModal {
  status: string
  message: string
  data: any
  error_message: string
}

interface listDoctor {
  totalPages: number
  totalItems: number
  currentPage: number
  first: boolean
  last: boolean
  pageItemSize: number
  pageSize: number
  items: Array<IDoctor>
}

export interface listAllDoctorsResponse {
  status: string
  message: string
  data: listDoctor
  error_message: string
}

export interface listPost {
  totalPages: number,
  totalItems: number,
  currentPage: number,
  first: boolean,
  last: boolean,
  pageItemSize: number,
  pageSize: number,
  items: IPostItem[]
}

export interface listAllPostsResponse {
  status: string
  message: string
  data: listPost
  error_message: string
}

export interface PostResponse {
  status: string
  data: IPostItem
}
