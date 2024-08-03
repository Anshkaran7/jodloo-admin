"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "sonner"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const Spinner: React.FC = () => (
  <div className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full border-t-transparent border-white"></div>
)

const Home: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  const handleLogin = async () => {
    console.log(email, password)
    router.push("/home")
    setLoading(true)

    // try {
    //   if (email.trim() === "" || password.trim() === "") {
    //     toast.error("Please enter both email and password")
    //     setLoading(false)
    //     return
    //   }

    //   // Simulate login success
    //   setLoading(false)
    //   toast.success("Login successful")
    //   router.push("/pinster")
    // } catch (error) {
    //   console.log(error, "Login error")
    //   setLoading(false)
    //   toast.error("Failed to login. Please try again")
    // }
  }

  return (
    <main className="flex h-screen bg-gray-100 flex-col items-center justify-center p-24">
      <Card className="w-[410px] shadow-xl">
        <Toaster />
        <CardHeader className="flex flex-col items-center">
          <Image
            src="/jodlo.png"
            width={80}
            height={80}
            alt="logo"
            className="w-20 h-20 mb-4"
          />
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full"
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 bottom-0 flex items-center px-2"
            >
              {showPassword ? (
                <FiEyeOff className="text-xl text-gray-500" />
              ) : (
                <FiEye className="text-xl text-gray-500" />
              )}
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Button
            onClick={handleLogin}
            className={`w-full text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Login"}
          </Button>
          <div className="mt-4 text-sm text-center">
            By clicking Login, you agree to our{" "}
            <Link href="/terms">
              <p className="text-blue-500 hover:underline">
                Terms and Conditions
              </p>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}

export default Home
