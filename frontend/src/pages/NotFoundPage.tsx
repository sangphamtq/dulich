import { Link } from "react-router-dom"
import Footer from "../components/Footer"

const NotFoundPage = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Content */}
        <div className="grow text-center my-20 flex flex-col justify-center">
          <h1 className="text-9xl font-semibold mb-8">404</h1>
          <p className="text-3xl mb-6">Ôi! Không tìm thấy trang này</p>
          <Link
            to="/"
            className="flex w-fit mx-auto border px-4 py-1 rounded-md font-medium hover:bg-primary hover:text-white transition ease-in"
          >
            Quay lại trang chủ
          </Link>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>

  )
}

export default NotFoundPage