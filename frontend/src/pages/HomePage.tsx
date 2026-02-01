
const HomePage = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1920&auto=format&fit=crop"
                    alt="Travel Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-purple-900/80 via-blue-900/70 to-cyan-900/80"></div>
            </div>

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>
                <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 h-full flex items-center justify-center">
                <div className="max-w-6xl mx-auto px-6 text-center">

                    <div className="mb-6 animate-fade-in">
                        <span className="inline-block px-6 py-2 bg-linear-to-r from-cyan-400 to-blue-500 text-white text-sm font-semibold rounded-full shadow-lg">
                            ✨ Chào mừng đến với VietTravel
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-7xl font-black text-white mb-8 leading-none">
                        Hành Trình
                        <span className="text-transparent bg-clip-text bg-linear-to-r px-3 from-cyan-300 via-blue-300 to-purple-300 animate-gradient">
                            Của Bạn
                        </span>
                        Bắt Đầu Ở Đây
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Khám phá những điểm đến tuyệt vời trên khắp thế giới.
                        Tạo nên những kỷ niệm đáng nhớ cùng chúng tôi.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        <button className="group relative px-10 py-5 bg-linear-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold rounded-full overflow-hidden shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
                            <span className="relative z-10 flex items-center">
                                Bắt đầu khám phá
                                <svg className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>

                        <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white text-lg font-bold rounded-full border-2 border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-xl">
                            Tìm hiểu thêm
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-linear-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">500+ Điểm đến</h3>
                            <p className="text-gray-300">Khám phá hàng trăm địa điểm tuyệt vời trên toàn thế giới</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-linear-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Giá tốt nhất</h3>
                            <p className="text-gray-300">Cam kết mức giá cạnh tranh và ưu đãi hấp dẫn</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-linear-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Đánh giá 4.9★</h3>
                            <p className="text-gray-300">Hơn 50.000 khách hàng hài lòng và tin tưởng</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <div className="flex flex-col items-center">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2">
                        <div className="w-1 h-3 bg-white/70 rounded-full animate-scroll"></div>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default HomePage