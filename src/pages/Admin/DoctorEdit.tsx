import React, { useEffect, useState, useMemo, forwardRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Tạo Quill component với forwardRef
const QuillWrapper = forwardRef<any, any>((props, ref) => {
  return <ReactQuill ref={ref} {...props} />;
});

const DoctorEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [doctor, setDoctor] = useState<{
    fullName: string;
    introduction: string;
    longIntroduction: string;
    title: string;
  }>({
    fullName: '',
    introduction: '',
    longIntroduction: '',
    title: ''
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`
          }
        });
        
        if (response.status === 404) {
          toast.error('Không tìm thấy thông tin bác sĩ');
          navigate('/admin/doctors');
          return;
        }
        
        if (!response.ok) throw new Error('Failed to fetch doctor');
        
        const result = await response.json();
        
        if (result.status === "OK" && result.data) {
          const doctorData = result.data;
          setDoctor({
            fullName: doctorData.fullName,
            introduction: doctorData.introduction,
            longIntroduction: doctorData.longIntroduction,
            title: doctorData.title
          });

          if (doctorData.image) {
            setImageBase64(doctorData.image);
          }
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Có lỗi xảy ra khi tải thông tin bác sĩ');
        navigate('/admin/doctors');
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id, navigate]);

  // Cấu hình cho ReactQuill
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  }), [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'font',
    'align',
    'link'
  ]

  // Thêm hàm chuyển file thành base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Cập nhật hàm xử lý file
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const base64 = await convertToBase64(file);
      setImageBase64(base64);
    }
  };

  // Cập nhật phần xử lý submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setSaving(true)

      const doctorData = {
        ...doctor,
        base64Image: imageBase64 // Thêm base64 vào data gửi đi
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        },
        body: JSON.stringify(doctorData)
      });

      if (!response.ok) {
        throw new Error('Failed to update doctor');
      }

      toast.success('Cập nhật thông tin bác sĩ thành công');
      navigate('/admin/doctors');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin bác sĩ');
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6' spellCheck={false}>
      <h2 className='text-2xl font-bold mb-6'>Chỉnh sửa thông tin bác sĩ</h2>

      <form onSubmit={handleSubmit} className='space-y-8 bg-white rounded-lg shadow p-6'>
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột trái - thông tin cơ bản */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Họ và tên</label>
              <input
                type='text'
                value={doctor.fullName}
                onChange={(e) => setDoctor({ ...doctor, fullName: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Chức danh</label>
              <input
                type='text'
                value={doctor.title}
                onChange={(e) => setDoctor({ ...doctor, title: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Giới thiệu ngắn</label>
              <textarea
                value={doctor.introduction}
                onChange={(e) => setDoctor({ ...doctor, introduction: e.target.value })}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
          </div>

          {/* Cột phải - hình ảnh */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Hình ảnh</h3>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-6">
                <div className="shrink-0 relative group cursor-pointer w-40 h-40">
                  {(imageFile || imageBase64) ? (
                    <div className="w-40 h-40 rounded-full overflow-hidden">
                      <img
                        src={imageFile ? URL.createObjectURL(imageFile) : imageBase64}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Giới thiệu chi tiết</h3>
          <div className='border rounded-md'>
            <QuillWrapper
              theme='snow'
              value={doctor.longIntroduction}
              onChange={(content: string) => setDoctor(prev => ({
                ...prev,
                longIntroduction: content
              }))}
              modules={modules}
              formats={formats}
              className='h-96 mb-12'
              preserveWhitespace={true}
            />
          </div>
        </div>

        <div className='flex justify-end gap-4 pt-6 border-t'>
          <button
            type='button'
            onClick={() => navigate('/admin/doctors')}
            className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
            disabled={saving}
          >
            Hủy
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400'
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DoctorEdit 