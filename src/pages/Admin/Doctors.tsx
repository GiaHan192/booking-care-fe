import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaUser, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast'

interface Doctor {
  id: number
  fullName: string
  introduction: string
  major: string
  title: string
  image: string
}

interface PaginationParams {
  page: number
  size: number
  totalPages: number
  totalItems: number
}

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null)
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    size: 10,
    totalPages: 0,
    totalItems: 0
  })
  const navigate = useNavigate();

  const fetchDoctors = async (page: number = 0) => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors?page=${page}&size=${pagination.size}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch doctors')

      const data = await response.json()
      setDoctors(data.data.items)
      setPagination({
        ...pagination,
        page: data.data.currentPage,
        totalPages: data.data.totalPages,
        totalItems: data.data.totalItems
      })
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchDoctors(newPage)
    }
  }


  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get('access_token')}`
        }
      })

      if (response.ok) {
        toast.success('Xóa bác sĩ thành công')
        fetchDoctors()
      } else {
        toast.error('Xóa bác sĩ thất bại')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Có lỗi xảy ra khi xóa bác sĩ')
    }
  }

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleViewDetails = (id: number) => {
    navigate(`/admin/doctors/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/doctors/edit/${id}`);
  };

  const handleCreateDoctor = () => {
    navigate('/admin/doctors/create');
  };

  return (
	<div className="p-6">
		<div className="sm:flex sm:items-center sm:justify-between mb-6">
		<h1 className="text-2xl font-semibold text-gray-900">Quản lý bác sĩ</h1>
		<div className="mt-4 sm:mt-0 flex items-center gap-4">
			<button
			onClick={handleCreateDoctor}
			className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
			>
			<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
			</svg>
			Thêm bác sĩ
			</button>
			<span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800">
			Tổng: {pagination.totalItems} bác sĩ
			</span>
		</div>
		</div>

		{loading ? (
		<div className="flex justify-center py-8">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
		</div>
		) : (
		<>
			<div className="mt-4 flex flex-col">
			<div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
				<div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
					<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ID
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Thông tin bác sĩ
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Giới thiệu
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Chức danh
							</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Thao tác
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{doctors.map(doctor => (
						<tr key={doctor.id} className="hover:bg-gray-50">
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
							{doctor.id}
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center">
									{doctor.image ? (
										<img
											src={doctor.image}
											alt={doctor.fullName}
											className="h-10 w-10 rounded-full object-cover"
										/>
									) : (
										<div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
											<FaUser className="h-5 w-5 text-gray-400" />
										</div>
									)}
									<div className="ml-4">
										<div className="text-sm font-medium text-gray-900">{doctor.fullName}</div>
									</div>
								</div>
							</td>
							<td className="px-6 py-4 text-sm text-gray-900 max-w-md">
							<div className="overflow-hidden" title={doctor.introduction}>
								{truncateText(doctor.introduction)}
							</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
							{doctor.title}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
							<button 
								onClick={() => handleViewDetails(doctor.id)}
								className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200"
							>
								<FaEye className="mr-1.5" />
								Chi tiết
							</button>
							<button 
								onClick={() => handleEdit(doctor.id)}
								className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200"
							>
								<FaEdit className="mr-1.5" />
								Sửa
							</button>
							<button 
								onClick={() => handleDelete(doctor.id)}
								className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-200"
							>
								<FaTrash className="mr-1.5" />
								Xóa
							</button>
							</td>
						</tr>
						))}
					</tbody>
					</table>
				</div>
				</div>
			</div>
			</div>

			{/* Pagination */}
			{doctors.length > 0 && (
			<div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
				<div className="flex flex-1 justify-between sm:hidden">
				<button
					onClick={() => handlePageChange(pagination.page - 1)}
					disabled={pagination.page === 0}
					className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
				>
					Trước
				</button>
				<button
					onClick={() => handlePageChange(pagination.page + 1)}
					disabled={pagination.page === pagination.totalPages - 1}
					className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
				>
					Sau
				</button>
				</div>
				<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-700">
					Hiển thị <span className="font-medium">{pagination.page * pagination.size + 1}</span> đến{' '}
					<span className="font-medium">
						{Math.min((pagination.page + 1) * pagination.size, pagination.totalItems)}
					</span>{' '}
					trong tổng số{' '}
					<span className="font-medium">{pagination.totalItems}</span> kết quả
					</p>
				</div>
				<div>
					<nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
					<button
						onClick={() => handlePageChange(pagination.page - 1)}
						disabled={pagination.page === 0}
						className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
					>
						<span className="sr-only">Previous</span>
						<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
						</svg>
					</button>
					
					{[...Array(pagination.totalPages)].map((_, index) => (
						<button
						key={index}
						onClick={() => handlePageChange(index)}
						className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
							pagination.page === index
							? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
							: 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
						}`}
						>
						{index + 1}
						</button>
					))}

					<button
						onClick={() => handlePageChange(pagination.page + 1)}
						disabled={pagination.page === pagination.totalPages - 1}
						className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
					>
						<span className="sr-only">Next</span>
						<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
						</svg>
					</button>
					</nav>
				</div>
				</div>
			</div>
			)}
		</>
		)}
	</div>
  )
}

export default Doctors 