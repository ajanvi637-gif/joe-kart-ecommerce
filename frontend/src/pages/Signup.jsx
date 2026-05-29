import { Button } from "@/components/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/card"

import { Input } from "@/input"
import { Label } from "@/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"
import { useNavigate } from "react-router-dom"




const Signup = () => {
    const [showPassword, setshowPassword] = useState(false)
    const [loading, setloading] = useState(false)
    const [formeData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    })


    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        console.log(formeData);
        try {
            setloading(true)
            const res = await axios.post(`http://localhost:8000/api/v1/user/register`,formeData,{
                Headers:{
                    "Content-Type":"application/json"
                }
            })
            if(res.data.success){
             navigate('/verify')
             toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)

        } finally {
            setloading(false)
        }

    }
    return (

        <div className='flex justify-center items-center min-h-screen bg-pink-100'>

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>create your account</CardTitle>
                    <CardDescription>
                        Enter given details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className='grid gap-2'>
                                <Label htmlFor="firstName">first Name </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="joe"
                                    required
                                    value={formeData.firstName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='grid gap-2'>
                                <Label htmlFor="lastName">Last Name </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="toee"
                                    required
                                    value={formeData.lastName}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={formeData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>

                            <div className='relative'>

                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="create a password"
                                    value={formeData.password}
                                    onChange={handleChange}
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                />
                                {
                                    showPassword ? <EyeOff onClick={() => setshowPassword(false)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2' /> :
                                        <Eye onClick={() => setshowPassword(true)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2' />
                                }
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button onClick={submitHandler} type="submit" className="w-full cursor-pointer bg-pink-500 
                    hover:bg-pink-700">
                    {loading? <><Loader2 className="h-4 w-4 animate-spin mr-2"/>Please Wait</>:'Signup'} 
                    </Button>

                    <Button variant="outline" className="w-full cursor-pointer" >
                        <p className="text-gray-700">Already have an account? <Link to={"/login"} className='hover:underline cursor-pointer
                         text-pink-800'>Login</Link></p>
                    </Button>

                </CardFooter>
            </Card>

        </div>
    )
}

export default Signup