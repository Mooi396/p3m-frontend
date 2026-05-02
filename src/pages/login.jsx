import React from 'react'
import LoginPage from '../components/loginPage'
import Head from '../components/head'

const Login = () => {
  return (
    <>
      <Head title={"Masuk"} />
      <div className='flex justify-center items-center min-h-screen'>
        <LoginPage/>
      </div>
    </>
  )
}
export default Login