import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode,Navigation } from "swiper/modules";
import 'swiper/css/navigation';
import { IPostItem } from "src/models/post";
import { listAllPostsResponse } from "src/models/api-response";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const HomePost: React.FunctionComponent<{ isHiddenTittle?: boolean }> = ({ isHiddenTittle = false }) => {
    const navigate = useNavigate()
    const [posts, setPosts] = useState<IPostItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    // let shuffledData = posts  
    useEffect(() => {
      
      const fetchPosts = async () => {
        try {
          const response: {data:listAllPostsResponse} = await axios.get('http://localhost:8080/api/posts')
          
          setPosts((response.data.data.items).sort(() => Math.random() - 0.5).slice(0, 10))
          setLoading(false)
        } catch (error) {
          setError('Failed to fetch posts information')
          setLoading(false)
        }
      }
  
      fetchPosts()
    }, []) // Empty dependency array to run only once when the component mounts
  
    if (loading) {
      return <p>Loading...</p> // Show loading state
    }
  
    if (error) {
      return <p>{error}</p> // Show error message if fetching fails
    }
    console.log(posts);
    return (
        <>
            <div className="flex justify-between mb-4">
                {!isHiddenTittle && <h2 className="text-2xl font-bold mb-4">Cẩm nang</h2>}
                <p onClick={()=>navigate("/posts")} className="cursor-pointer rounded-2xl bg-transparent px-0 py-2.5 sm:bg-[#DAF3F6] sm:px-1.5 sm:py-2.5 md:mr-0 lg:px-2 text-sm font-semibold text-[#34929E] sm:text-lg sm:leading-6 md:leading-7 lg:text-xl lg:leading-8">Xem tất cả</p>
            </div>
            <Swiper
                spaceBetween={16}
                slidesPerView={4}
                freeMode={true}
                navigation={{
                    nextEl: '.button-next',
                    prevEl: '.button-prev',
                }}
                loop={true}
                modules={[FreeMode,Navigation]}
                breakpoints={{
                    320: {
                    slidesPerView: 1, // Hiển thị 1 slide trên màn hình nhỏ (320px+)
                    },
                    576: {
                    slidesPerView: 2, // Hiển thị 2 slide trên màn hình trung bình (640px+)
                    },
                    768: {
                    slidesPerView: 3, // Hiển thị 3 slide trên màn hình lớn hơn (768px+)
                    },
                    1024: {
                    slidesPerView: 4, // Hiển thị 4 slide trên màn hình lớn (1024px+)
                    },
                }}
            >
                {posts.map((post, index) => (
                    <SwiperSlide key={index} className="cursor-pointer" onClick={()=>navigate(`/post/detail/${post.id}`)}>
                        <div key={index} className={`w-full border border-blue-steel-1 rounded-xl shadow-2 p-2`}>
                            <div className="flex flex-col">
                                <div className="aspect-video overflow-hidden rounded-lg mb-2">
                                    <img className="w-full h-full object-cover" src={post.thumbnail} alt={post.title} />
                                </div>
                                <p className="mt-2 font-semibold">{post.title}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="mt-4 flex justify-end">
                <div className="gap-4 p-3 border border-[#BEBEBE] w-fit flex rounded-full">
                    <div className="button-prev cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="none" width="22" height="24" fill="#34929E"><path d="m148.7 411.3-144-144C1.563 264.2 0 260.1 0 256s1.562-8.188 4.688-11.31l144-144c6.25-6.25 16.38-6.25 22.62 0s6.25 16.38 0 22.62L54.63 240H496c8.8 0 16 7.2 16 16s-7.156 16-16 16H54.63l116.7 116.7c6.25 6.25 6.25 16.38 0 22.62s-16.43 6.28-22.63-.02"></path></svg>
                    </div>
                    <div className="button-next cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="none" width="22" height="24" fill="#34929E"><path d="m363.3 100.7 144 144c3.1 3.1 4.7 7.2 4.7 10.4s-1.562 8.188-4.688 11.31l-144 144c-6.25 6.25-16.38 6.25-22.62 0s-6.25-16.38 0-22.62l116.7-116.7H16c-8.844 0-16-7.156-16-15.1 0-8.844 7.156-16 16-16h441.4l-116.7-116.7c-6.25-6.25-6.25-16.38 0-22.62s16.4-6.23 22.6.03"></path></svg>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePost;