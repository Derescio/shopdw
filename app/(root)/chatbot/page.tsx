// import HealthIcon from '@/public/images/health.svg'
// import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TestPage = () => {
    return (<>

        <div>
            <Link href="/">
                <Button variant="outline" className="mt-4">Go Back Home</Button>
            </Link>
        </div>
        {/* <div className="min-h-screen bg-gray-50">
          
            <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
                <h1 className="text-xl font-bold text-[#1bbcce]">Insove</h1>
                <nav>
                    <ul className="flex space-x-6 text-gray-600">
                        <li><a href="#" className="hover:text-[#1bbcce]">Home</a></li>
                        <li><a href="#" className="hover:text-[#1bbcce]">Doctors</a></li>
                        <li><a href="#" className="hover:text-[#1bbcce]">Department</a></li>
                        <li><a href="#" className="hover:text-[#1bbcce]">Services</a></li>
                        <li><a href="#" className="hover:text-[#1bbcce]">Blog</a></li>
                        <li><a href="#" className="hover:text-[#1bbcce]">Contact</a></li>
                    </ul>
                </nav>
                <button className="bg-[#1bbcce] text-white px-4 py-2 rounded-md">Book Now</button>
            </header>

           
            <section className="flex items-center justify-center text-center py-16 px-8">
                <div className="max-w-2xl">
             

                    <div className="bg-white/90  inline-flex items-center rounded-full px-4 py-1 shadow-md">
                        <Image src={HealthIcon} alt="Health Icon" width={24} height={24} className="mr-2" />
                        <p className="text-[#1bbcce]  font-medium">LIVE YOUR LIFE</p>
                    </div>

                    <h2 className="text-4xl font-bold text-gray-800 my-4">We Care About Your Health</h2>
                    <p className="text-gray-600">Vitae aliquam vestibulum elit adipiscing massa diam in dignissim. Risus tellus libero elementum aliquam etiam.</p>
                    <button className="mt-6 bg-[#1bbcce] text-white px-6 py-3 rounded-md">Contact Us</button>
                </div>
            </section>

            
            <section className="bg-white py-12 px-6 grid grid-cols-4 text-center gap-4">
                <div>
                    <p className="text-3xl font-bold text-[#1bbcce]">+5120</p>
                    <p className="text-gray-600">Happy Patients</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-[#1bbcce]">+26</p>
                    <p className="text-gray-600">Expert Doctors</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-[#1bbcce]">+53</p>
                    <p className="text-gray-600">Departments</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-[#1bbcce]">+10</p>
                    <p className="text-gray-600">Years of Experience</p>
                </div>
            </section>
        </div> */}

    </>);
}

export default TestPage;