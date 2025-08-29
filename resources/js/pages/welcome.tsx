import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-indigo-600 p-4 rounded-full">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 3h10a2 2 0 012 2v14l-7-3-7 3V5a2 2 0 012-2z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        📚 Student Attendance System
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Streamline attendance tracking for educational institutions with our modern, intuitive platform designed for administrators and teachers.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {/* Admin Features */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 ml-3">👑 Admin Control</h3>
                        </div>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Manage students and classes
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Comprehensive absence reports
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Advanced filtering by date, class & status
                            </li>
                        </ul>
                    </div>

                    {/* Teacher Features */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 ml-3">👩‍🏫 Teacher Tools</h3>
                        </div>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Quick attendance marking
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Multiple status options
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Class-specific access control
                            </li>
                        </ul>
                    </div>

                    {/* System Features */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 ml-3">⚡ Smart Features</h3>
                        </div>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Real-time dashboard analytics
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Secure role-based access
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                Modern minimalist design
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Attendance Status Options */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-16 border border-gray-100">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                        📋 Attendance Status Options
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">✅ Present</span>
                        <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">🔐 Permission</span>
                        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">🤒 Sick</span>
                        <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium">⏰ Late</span>
                        <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium">❌ Absent</span>
                    </div>
                </div>

                {/* Demo Screenshot Placeholder */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-16 border border-gray-100">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                        🖥️ Dashboard Preview
                    </h3>
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg h-64 flex items-center justify-center">
                        <div className="text-center text-white">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <p className="text-lg font-medium">Interactive Analytics Dashboard</p>
                            <p className="opacity-80">Real-time attendance tracking & reporting</p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Get Started? 🚀
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Join thousands of educators using our attendance management system
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login">
                            <Button 
                                size="lg" 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                🔐 Login to Your Account
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button 
                                variant="outline" 
                                size="lg"
                                className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                📝 Create New Account
                            </Button>
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        Demo credentials: admin@example.com / password
                    </p>
                </div>
            </div>
        </div>
    );
}