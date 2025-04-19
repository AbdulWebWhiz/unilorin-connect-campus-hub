
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="w-full py-4 px-6 bg-white border-b border-gray-200 fixed top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold text-2xl text-uniblue-500">UniConnect</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-uniblue-500"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              className="bg-uniblue-500 hover:bg-uniblue-600 text-white"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Connect with the 
              <span className="text-uniblue-500"> University of Ilorin </span> 
              community
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              UniConnect makes campus life easier. Buy and sell textbooks, find roommates, 
              share resources, and stay updated on campus events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-uniblue-500 hover:bg-uniblue-600 text-white"
                onClick={() => navigate('/signup')}
              >
                Join Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-uniblue-500 text-uniblue-500 hover:bg-uniblue-50"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
          </div>
          <div className="hidden md:block animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              alt="University students"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need in One Place</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Marketplace',
                description: 'Buy, sell, and trade textbooks, electronics, and more with other students.',
                icon: '🛒'
              },
              {
                title: 'Events',
                description: 'Stay updated on campus events, club meetings, and social gatherings.',
                icon: '📅'
              },
              {
                title: 'Resources',
                description: 'Share and access lecture notes, past papers, and study guides.',
                icon: '📚'
              },
              {
                title: 'Chat',
                description: 'Connect directly with classmates and friends through our messaging system.',
                icon: '💬'
              },
              {
                title: 'Lost & Found',
                description: 'Report lost items or help return found items to their owners.',
                icon: '🔍'
              },
              {
                title: 'Notifications',
                description: 'Get alerts about messages, marketplace activity, and campus announcements.',
                icon: '🔔'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-6 bg-uniblue-500 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to join the University of Ilorin community?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sign up today and connect with thousands of students on campus.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-uniblue-500 hover:bg-gray-100"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-xl text-white">UniConnect</span>
              <p className="mt-2">University of Ilorin Campus Hub</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>© 2025 UniConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
