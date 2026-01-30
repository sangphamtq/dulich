import { useAuth } from '../auth/AuthContext'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import api from '../libs/axios';

const GoogleLoginButton = () => {
  const auth = useAuth();
  const login = auth?.login;

  const handleSuccess = async (credentialResponse: { credential: string }) => {
    const decoded: any = jwtDecode(credentialResponse.credential);

    const res = await api.post('/auth/google', {
      googleId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture
    });

    if (login) {
      login(res.data.token);
    }
  }

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (credentialResponse.credential) {
          handleSuccess({ credential: credentialResponse.credential });
        } else {
          console.log('No credential received from Google');
        }
      }}
      onError={() => console.log('Đăng nhập google lỗi')}
    />
  )
}

export default GoogleLoginButton