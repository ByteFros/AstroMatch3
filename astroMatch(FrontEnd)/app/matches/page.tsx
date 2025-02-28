import SwipeInterface from "./components/swipe-interface"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-rose-100 to-rose-200">
      <h1 className="text-3xl font-bold text-rose-600 mb-8">Dating App</h1>
      <SwipeInterface />
    </main>
  )
}

