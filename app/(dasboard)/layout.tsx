import Navbar from './_components/navbar'

interface DashboardLayoutPage {
  children: React.ReactNode
}

const DashboardLayout = ({children}: DashboardLayoutPage) => {
  return (
      <main className='h-full px-0 2xl:px-56'>
        <Navbar/>
        {children}
      </main>
  )
}

export default DashboardLayout