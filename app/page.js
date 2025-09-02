import React from 'react'
import Navbar from './componenets/Navbar'
import Hero from './componenets/Hero'
import Footer from './componenets/Footer'
import FeaturesSection from './componenets/FeaturesSection'

const page = () => (

  <main>





    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-indigo-50">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <Footer />
    </div>




  </main>
)

export default page