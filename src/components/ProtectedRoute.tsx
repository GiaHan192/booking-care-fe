import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  sub: string
  role: string
  exp: number
  fullName: string
}

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const token = Cookies.get('access_token')

  if (!token) {
    return <Navigate to='/login' />
  }

  try {
    const decoded = jwtDecode(token) as JwtPayload
    if (decoded.role !== 'ROLE_ADMIN') {
      return <Navigate to='/' />
    }
  } catch {
    return <Navigate to='/login' />
  }

  return <>{children}</>
}

export default ProtectedAdminRoute
