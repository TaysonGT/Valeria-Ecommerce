import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
  const { login, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  
  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      await login(username.trim(), password)
      setLoginSuccess(true)
    } catch (error: any) {
      toast.error(error.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }
  useEffect(()=>{
    if(loginSuccess&&!authLoading&&!loading){
      const from = location.state?.from || '/';
      console.log(from)
      toast.success('Signed in successfully')
      navigate(from, { replace: true })
    }
  },[authLoading,loading,loginSuccess])


  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f4f4f4] px-4 font-[Outfit]'>
      <div className='max-w-md w-full bg-white rounded-3xl shadow-xl p-8'>
        <h2 className='text-3xl font-extralight text-center'>Sign In</h2>
        <form onSubmit={onSubmit} className='space-y-4 mt-8'>
          <label className='block'>
            <span className='text-sm font-medium px-2'>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-black focus:outline-none'
              placeholder='username'
              required
            />
          </label>
          <label className='block'>
            <span className='text-sm font-medium px-2'>Password</span>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-black focus:outline-none'
              placeholder='password'
              required
            />
          </label>
          <button
            type='submit'
            className='w-full rounded-xl bg-black py-3 text-white transition hover:bg-[#333] disabled:opacity-60'
            disabled={loading || authLoading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className='mt-6 text-center text-sm text-gray-600'>
          New here?{' '}
          <span onClick={() => navigate('/auth/register')} className='cursor-pointer  font-medium text-black'>
            Create an account
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
