import React from 'react'
import RegisterPage from '../components/registerPage'
import Head from '../components/head'

const Register = () => {
  return (
    <>
      <Head title={"Daftar"} />
      <div className='flex justify-center items-center min-h-screen'>
        <RegisterPage/>
      </div>
    </>
  )
}

export default Register