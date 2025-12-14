import { RegisterForm } from '@/components/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Partner Registration
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Fill in your details to become a partner and get your unique partner code
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

