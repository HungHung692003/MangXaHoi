import { useState } from 'react'
import { Form, Input, message, Typography } from 'antd'
import Link from '../Link.jsx'
import Button from '../Button.jsx'
import { axiosInstance } from '../../axios.js'
import { useAuth } from '../../store.js'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
const { Title } = Typography

const ForgotPasswordPage = () => {
  const [form] = Form.useForm()

  const [query] = useSearchParams()
  const token = query.get('token')
  const [email, setEmail] = useState('')

  const handleSend = () => {
    try {
      console.log('email ', email)
      const res = axios.post('http://localhost:3000/api/resend-forgot-password', { email })
      console.log('res', res)
      setTimeout(() => {
        toast.success('Đã gửi mã xác nhận qua email')
      }, 2000)
    } catch (err) {
      console.log(err)
    }
  }

  const handleBtn = () => {
    setTimeout(() => {
      toast.success('Đã gửi mã thành công')
    }, 2000)
  }

  return (
    <main className='flex overflow-hidden flex-col items-center px-20 pt-16 text-lg bg-white pb-[544px] max-md:px-5 max-md:pb-24'>
      <div className='flex flex-col max-w-full w-[450px]'>
        <img
          loading='lazy'
          src='https://cdn.builder.io/api/v1/image/assets/TEMP/bef80e460a0946a1cac96cf3ab2dc17be65b97af1ad29bcda78b3491d138c5d6?placeholderIfAbsent=true&apiKey=ee3b4c55f4e940649da4e87de99f1704'
          className='object-contain aspect-[1.22] w-[50px]'
          alt='Twitter logo'
        />
        <Title level={1} className='self-start mt-9 text-5xl font-black text-black max-md:ml-2.5'>
          Forgot password{' '}
        </Title>
        {token ? (
          <Form form={form}>
            <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input type='password' placeholder='Password' className='mt-6 h-16' aria-label='Password' />
            </Form.Item>
            <Form.Item
              name='confirmPassword'
              rules={[{ required: true, message: 'Please input your confirmPassword!' }]}
            >
              <Input type='password' placeholder='Confirm Password' className='mt-6 h-16' aria-label='Password' />
            </Form.Item>
            <Form.Item>
              <Button
                className='mt-6 w-full h-12
            '
                htmlType='submit'
              >
                Reset{' '}
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form form={form}>
            <Form.Item
              name='email'
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
            >
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type='text'
                placeholder='Email address'
                className='mt-9 h-16'
                aria-label='Email'
              />
            </Form.Item>

            <Form.Item>
              <div onClick={handleSend}>
                {' '}
                <Button className='mt-6 w-full h-12' onClick={handleBtn}>
                  Send
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </div>
      <div className='flex gap-5 justify-start mt-10 text-sky-500 max-md:max-w-full'>
        <Link href='/login'>Login</Link>
      </div>
    </main>
  )
}

export default ForgotPasswordPage