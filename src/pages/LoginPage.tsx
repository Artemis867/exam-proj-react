import React, {useState, useCallback, useEffect} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios";
import SignupForm from "./SignupForm";



export default function LoginPage() {
  
  const navigate = useNavigate();

  const [showSignup, setShowSignup] = useState(false);
  const [showError, setShowError] = useState('');


  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if(token && username) {
      navigate('/profile');
    }

  }, []);
  const formSchema = z.object({
    username: z.string().min(8, {
      message: "Username must be at least 8 characters.",
    }).max(20, {
      message: "Username should not exceed to 20 characters"
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(20, {
      message: "Password should not exceed to 20 characters"
    }),
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {  
      const result = await axios.post("http://localhost:4000/user/login", values);

      if(result.data.success == true) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('username', values.username);
        navigate('/profile');
      }

    } catch (err) {
      console.log('ERROR: ');
      console.log(err);
      setShowError(err.response.data.message);
    }

  };

  const alertErrorMarkup = (
    <Alert variant="destructive" className="w-[340px] m-1">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {showError}
      </AlertDescription>
    </Alert>
  );

  const LoginFormMarkUp = (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Welcome to ExamApp</CardTitle>
        <CardDescription>Login your credentials.</CardDescription>
      </CardHeader>
      {showError !== '' ? alertErrorMarkup : null}
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <CardContent>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      Add post here
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      Add post here
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* <Button variant="outline">Cancel</Button> */}
          <Button type="submit">Login</Button>
          <Button type="button" variant="outline" onClick={e => onShowSignup(true)}>Signup</Button>
        </CardFooter>
      </form>
      </Form>
    </Card>
  );

 

  const onShowSignup = useCallback((toggle) => {
    setShowSignup(toggle);
  }, [showSignup]);

  const handleShowSignUp= (toggle) => {
    setShowSignup(toggle);
  }


  return (
    <div className="flex justify-center m-5 w-[100%]">
      <div>
        { !showSignup ? LoginFormMarkUp : <SignupForm handleShowSignUp={handleShowSignUp}/> }
      </div>
    </div>
  )
}