import React from 'react';
import { User, Shield, Users, Mic } from 'lucide-react';

const RoleSelector = ({ onSelectRole }) => {
  const roles = [
    {
      id: 'kiosk',
      title: 'Rural Kiosk',
      titleHindi: 'ग्रामीण किओस्क',
      description: 'Voice-only complaint submission',
      descriptionHindi: 'आवाज से शिकायत दर्ज करें',
      icon: Mic,
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700'
    },
    {
      id: 'officer',
      title: 'Officer Portal',
      titleHindi: 'अधिकारी पोर्टल',
      description: 'Manage assigned complaints',
      descriptionHindi: 'शिकायतों का प्रबंधन करें',
      icon: User,
      color: 'from-blue-500 to-indigo-600',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-700'
    },
    {
      id: 'admin',
      title: 'Super Admin',
      titleHindi: 'सुपर एडमिन',
      description: 'System management & oversight',
      descriptionHindi: 'सिस्टम प्रबंधन',
      icon: Shield,
      color: 'from-purple-500 to-pink-600',
      hoverColor: 'hover:from-purple-600 hover:to-pink-700'
    },
    {
      id: 'citizen',
      title: 'Citizen Portal',
      titleHindi: 'नागरिक पोर्टल',
      description: 'Track complaint status',
      descriptionHindi: 'शिकायत की स्थिति देखें',
      icon: Users,
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Unified Civic Voice Platform
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-6">
            एकीकृत नागरिक आवाज मंच
          </h2>
          <p className="text-xl text-gray-600">
            Empowering Rural Communities with Smart Complaint Management
          </p>
          <p className="text-lg text-gray-500">
            स्मार्ट शिकायत प्रबंधन के साथ ग्रामीण समुदायों को सशक्त बनाना
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className={`
                  bg-gradient-to-br ${role.color} ${role.hoverColor}
                  text-white rounded-2xl p-8 shadow-xl
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-2xl
                  focus:outline-none focus:ring-4 focus:ring-purple-300
                  group
                `}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:bg-white/30 transition-all">
                    <Icon size={48} className="group-hover:scale-110 transition-transform" />
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold mb-2">{role.title}</h3>
                    <p className="text-2xl font-semibold mb-3 opacity-90">{role.titleHindi}</p>
                    <p className="text-lg opacity-90">{role.description}</p>
                    <p className="text-base opacity-80">{role.descriptionHindi}</p>
                  </div>

                  <div className="mt-4 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold">
                    Click to Enter • प्रवेश करें
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            Powered by AI Voice Recognition & Smart Complaint Routing
          </p>
          <p className="text-xs mt-2">
            एआई आवाज पहचान और स्मार्ट शिकायत रूटिंग द्वारा संचालित
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
