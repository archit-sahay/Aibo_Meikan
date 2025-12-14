import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Become a Partner. Grow With Us.
          </h1>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            We are creating a powerful platform where you can sell financial instruments effortlessly and earn consistent income.
            Whether you're an experienced professional or just stepping into the world of finance, our ecosystem is built to unlock your potential and expand your opportunities.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Join us as a trusted partner and be part of a fast-growing financial marketplace. Together, we'll build new possibilities, open revenue streams, and achieve success as one team.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            Partner with us today — your growth story starts here.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Register as Partner
          </Link>
        </div>
      </div>
    </div>
  )
}

