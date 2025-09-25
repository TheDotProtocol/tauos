export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">TauOS Test Page</h1>
        <p className="text-xl text-gray-300">If you can see this, the deployment is working!</p>
        <div className="mt-8">
          <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">τ</span>
          </div>
          <p className="text-sm text-gray-400">TauOS - Privacy-First Operating System</p>
        </div>
      </div>
    </div>
  );
} 