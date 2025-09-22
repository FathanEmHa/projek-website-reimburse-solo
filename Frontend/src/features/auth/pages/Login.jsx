import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '@/utils/auth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        setError(data.message || "Login gagal");
        return;
      }

      const data = await res.json()
      loginUser(data);
      switch (data.user.role) {
        case "employee":
        navigate("dashboard/employee");
        break;
        case "manager":
        navigate("dashboard/manager");
        break;
        case "finance":
        navigate("dashboard/finance");
        break;
        case "admin":
        navigate("dashboard/admin");
        break;
        default:
        navigate("aunaothorized");
      }

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/90 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, Sir!</h1>
        <p className="text-gray-500 mb-6">Please, Login to continue!</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="bg-red-100 text-red-600 text-sm p-2 rounded-md mb-4">
                {error}
            </p>
          )}

          <Button type="submit">Masuk</Button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Belum punya akun?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Daftar
          </a>
        </p>
      </div>
    </div>
  )
}
