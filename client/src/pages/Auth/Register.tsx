import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formState, setFormState] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    gender: '',
    password: '',
    validPassword: '',
  })
  const [loading, setLoading] = useState(false)

  const onChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formState.password !== formState.validPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      setLoading(true)
      await register(formState)
      toast.success('Account created successfully. Please sign in.')
      navigate('/auth/login')
    } catch (error: any) {
      toast.error(error.message || 'Unable to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f4f4f4] p-2 lg:px-4 lg:py-6 font-[Outfit]'>
      <div className='max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8'>
        <h2 className='text-2xl lg:text-3xl font-light text-center'>Create a new account</h2>
        <form onSubmit={onSubmit} className='grid gap-4 mt-8'>
          <div className='grid gap-4 md:grid-cols-2'>
            <label className='block'>
              <span className='text-sm font-medium px-2 mb-1 block'>Username</span>
              <input
                value={formState.username}
                onChange={(e) => onChange('username', e.target.value)}
                className='w-full rounded-xl border border-[#949494] px-4 py-3 focus:border-black focus:outline-none'
                placeholder='username'
                required
              />
            </label>
            <label className='block'>
              <span className='text-sm font-medium px-2 mb-1 block'>Email</span>
              <input
                type='email'
                value={formState.email}
                onChange={(e) => onChange('email', e.target.value)}
                className='w-full rounded-xl border border-[#949494] px-4 py-3 focus:border-black focus:outline-none'
                placeholder='email@example.com'
                required
              />
            </label>
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <label className='block'>
              <span className='text-sm font-medium px-2 mb-1 block'>First Name</span>
              <input
                value={formState.firstname}
                onChange={(e) => onChange('firstname', e.target.value)}
                className='w-full rounded-xl border border-[#949494] px-4 py-3 focus:border-black focus:outline-none'
                placeholder='First name'
                required
              />
            </label>
            <label className='block'>
              <span className='text-sm font-medium px-2 mb-1 block'>Last Name</span>
              <input
                value={formState.lastname}
                onChange={(e) => onChange('lastname', e.target.value)}
                className='w-full rounded-xl border border-[#949494] px-4 py-3 focus:border-black focus:outline-none'
                placeholder='Last name'
                required
              />
            </label>
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <label className='block'>
              <span className='text-sm font-medium px-2 mb-1 block'>Gender</span>
              <select
                value={formState.gender}
                onChange={(e) => onChange('gender', e.target.value)}
                className='w-full rounded-xl border border-[#949494] bg-white px-4 py-3 focus:border-black focus:outline-none'
                required
              >
                <option value=''>Select gender</option>
                <option value='female'>Female</option>
                <option value='male'>Male</option>
              </select>
            </label>
            <label className='block'>
              <span className='text-sm font-medium px-2 mb-1 block'>Password</span>
              <input
                type='password'
                value={formState.password}
                onChange={(e) => onChange('password', e.target.value)}
                className='w-full rounded-xl border border-[#949494] px-4 py-3 focus:border-black focus:outline-none'
                placeholder='Password'
                required
              />
            </label>
          </div>
          <label className='block'>
            <span className='text-sm font-medium px-2 mb-1 block'>Confirm Password</span>
            <input
              type='password'
              value={formState.validPassword}
              onChange={(e) => onChange('validPassword', e.target.value)}
              className='w-full rounded-xl border border-[#949494] px-4 py-3 focus:border-black focus:outline-none'
              placeholder='Confirm password'
              required
            />
          </label>
          <button
            type='submit'
            className='w-full rounded-xl bg-black py-3 text-white transition hover:bg-[#333] disabled:opacity-60'
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
          <p className='text-center text-sm text-gray-600'>
            Already have an account?{' '}
            <span onClick={() => navigate('/auth/login')} className='cursor-pointer font-medium text-black'>
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
