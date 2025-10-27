import { useState } from 'react'
import emailjs from '@emailjs/browser'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    mobile: '',
    message: ''
  })
  
  const [otp, setOtp] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_KEY = 'ee1a0f74-b284-11f0-bdde-0200cd936042'
  
  // EmailJS Configuration
  const EMAILJS_SERVICE_ID = 'service_fufd8ef' // Replace with your EmailJS service ID
  const EMAILJS_TEMPLATE_ID = 'template_0vnftyp' // Replace with your EmailJS template ID
  const EMAILJS_PUBLIC_KEY = 'LIWCYSURBhmMwJamb' // Replace with your EmailJS public key

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(mobile)
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const sendOTP = async () => {
    if (!validateMobile(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Using AUTOGEN2 which sends SMS instead of voice call
      const response = await fetch(
        `https://2factor.in/API/V1/${API_KEY}/SMS/${formData.mobile}/AUTOGEN/CAPITALSPARK_OTP`,
        { method: 'GET' }
      )
      
      const data = await response.json()
      
      if (data.Status === 'Success') {
        setSessionId(data.Details)
        setOtpSent(true)
        setSuccess('OTP sent successfully via SMS to your mobile number!')
      } else {
        setError(data.Details || 'Failed to send OTP. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      console.error('Send OTP Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`,
        { method: 'GET' }
      )
      
      const data = await response.json()
      
      if (data.Status === 'Success' && data.Details === 'OTP Matched') {
        setOtpVerified(true)
        setSuccess('Mobile number verified successfully!')
        setError('')
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      console.error('Verify OTP Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      return
    }
    
    if (!otpVerified) {
      setError('Please verify your mobile number with OTP')
      return
    }

    // Send email using EmailJS
    setLoading(true)
    try {
      const templateParams = {
        from_name: formData.name,
        company_name: formData.company || 'Not provided',
        from_email: formData.email,
        mobile_number: formData.mobile,
        message: formData.message || 'No message provided',
        to_email: 'capitalspark100@example.com' // Replace with your email
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )

      console.log('Form submitted:', formData)
      setSuccess('Form submitted successfully! We will contact you soon.')
      
      // Reset form
      setTimeout(() => {
        setFormData({ name: '', company: '', email: '', mobile: '', message: '' })
        setOtp('')
        setOtpSent(false)
        setOtpVerified(false)
        setSessionId('')
        setSuccess('')
      }, 3000)
    } catch (emailError) {
      console.error('Email send error:', emailError)
      setError('Form submitted but failed to send email notification. Please contact us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Banner Image */}
            <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
              
              <div className="relative z-10 text-center">
                {/* Icon/Logo */}
                <div className="mb-8">
                  <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                
                <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                <p className="text-lg text-blue-100 mb-8">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-4 text-left max-w-sm mx-auto">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>capitalspark100@example.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+91 XXXXX XXXXX</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Mon - Fri: 9AM - 6PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
                <p className="mt-2 text-gray-600">Fill out the form below and we'll get back to you soon.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
            {/* Alert Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Company Name Field */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                    placeholder="Enter your company name (optional)"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Mobile Number with OTP */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      disabled={otpVerified}
                      required
                    />
                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={sendOTP}
                        disabled={loading || otpSent}
                        className={`px-4 py-2.5 rounded-lg font-medium transition duration-200 whitespace-nowrap text-sm ${
                          otpSent
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                        }`}
                      >
                        {loading ? 'Sending...' : otpSent ? 'Sent' : 'Send OTP'}
                      </button>
                    )}
                    {otpVerified && (
                      <div className="flex items-center px-4 py-2.5 bg-green-100 text-green-700 rounded-lg text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </div>
                    )}
                  </div>
                </div>

                {/* OTP Input */}
                {otpSent && !otpVerified && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Enter OTP <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          if (value.length <= 6) setOtp(value)
                        }}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-sm"
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                      />
                      <button
                        type="button"
                        onClick={verifyOTP}
                        disabled={loading || otp.length !== 6}
                        className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 active:scale-95 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                      >
                        {loading ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Didn't receive OTP?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false)
                          setOtp('')
                          sendOTP()
                        }}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Resend
                      </button>
                    </p>
                  </div>
                )}

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none resize-none text-sm"
                    placeholder="How can we help you? (optional)"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!otpVerified || loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 active:scale-98 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? 'Submitting...' : 'Submit Contact Form'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By submitting this form, you agree to our terms and conditions.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
