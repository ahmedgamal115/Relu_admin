import Navbar from "../Components/Navbar"

const Dashboard = ({ page, pageName }) => {
    return (
        <>
        <div className="min-h-full">
        <Navbar/>
        <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{pageName}</h1>
            </div>
        </header>
        <main className="w-full">
            <div className="mx-auto lg:max-w-[80%] sm:max-w-full max-sm:max-w-full py-6 sm:px-6 lg:px-0">{page}</div>
        </main>
        </div>
    </>
    )
}

export default Dashboard